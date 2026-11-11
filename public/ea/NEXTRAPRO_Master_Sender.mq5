//+------------------------------------------------------------------+
//| NEXTRAPRO_Master_Sender.mq5                                       |
//| Install on the MASTER MT5 account only.                           |
//| Sends OPEN / CLOSE / MODIFY events to the NEXTRAPRO webhook.      |
//| MT5: Tools > Options > Expert Advisors > Allow WebRequest for:    |
//|      https://nextra-pro-trader.lovable.app                        |
//+------------------------------------------------------------------+
#property copyright "NEXTRAPRO"
#property version   "1.00"
#property strict

input string ProviderToken = "";   // Private provider (bot) token from the dashboard
input int    MaxRetries    = 5;    // Attempts per event before giving up
input int    TimerSeconds  = 1;    // Queue / scan interval

const string WEBHOOK = "https://nextra-pro-trader.lovable.app/api/public/ea/signal";

struct Pos { ulong ticket; double sl; double tp; };
struct Ev  { string key; string body; int tries; datetime nextTry; };

Pos    known[];
Ev     queue[];
string sentKeys[];
int    signalsSent = 0, failures = 0;
string status = "Starting...";
datetime lastOk = 0;

//--- helpers ---------------------------------------------------------
bool WasSent(string k){ for(int i=ArraySize(sentKeys)-1;i>=0;i--) if(sentKeys[i]==k) return true; return false; }
void MarkSent(string k){ int n=ArraySize(sentKeys); if(n>=500){ ArrayRemove(sentKeys,0,100); n=ArraySize(sentKeys);} ArrayResize(sentKeys,n+1); sentKeys[n]=k; }
bool Queued(string k){ for(int i=0;i<ArraySize(queue);i++) if(queue[i].key==k) return true; return false; }
int  FindKnown(ulong t){ for(int i=0;i<ArraySize(known);i++) if(known[i].ticket==t) return i; return -1; }
string D(double v){ return DoubleToString(v,8); }

void Enqueue(string action, ulong ticket, string symbol, string side, double vol, double price, double sl, double tp)
{
   string key = action+"|"+(string)ticket+(action=="modify" ? "|"+D(sl)+"|"+D(tp) : "");
   if(WasSent(key) || Queued(key)) return;               // duplicate protection
   string body = "action="+action+"&ticket="+(string)ticket+"&symbol="+symbol;
   if(side!="") body += "&side="+side;
   body += "&volume="+DoubleToString(vol,2)+"&price="+D(price)+"&sl="+D(sl)+"&tp="+D(tp)+"&ts="+(string)(long)TimeGMT();
   int n=ArraySize(queue); ArrayResize(queue,n+1);
   queue[n].key=key; queue[n].body=body; queue[n].tries=0; queue[n].nextTry=0;
}

// returns true when the event is finished (sent, duplicate, or permanently rejected)
bool Post(Ev &e)
{
   char data[], res[]; string rh;
   StringToCharArray(e.body, data, 0, StringLen(e.body));
   string headers = "Content-Type: application/x-www-form-urlencoded\r\nx-ea-token: "+ProviderToken+"\r\n";
   ResetLastError();
   int code = WebRequest("POST", WEBHOOK, headers, 5000, data, res, rh);
   string reply = CharArrayToString(res);
   if(code==200){ signalsSent++; lastOk=TimeCurrent(); status="Connected"; MarkSent(e.key); Print("NEXTRAPRO sent ",e.key," ",reply); return true; }
   if(code==-1){ status="WebRequest blocked - allow the URL in Options (err "+(string)GetLastError()+")"; }
   else if(code==401){ status="Invalid provider token"; failures++; return true; }
   else if(code==400){ Print("NEXTRAPRO rejected ",e.key," ",reply); failures++; return true; }
   else status="Server error "+(string)code+" - retrying";
   return false;
}

void ProcessQueue()
{
   for(int i=0;i<ArraySize(queue);i++)
   {
      if(TimeCurrent() < queue[i].nextTry) continue;
      bool done = Post(queue[i]);
      if(!done)
      {
         queue[i].tries++;
         if(queue[i].tries >= MaxRetries){ failures++; Print("NEXTRAPRO gave up on ",queue[i].key); done=true; }
         else queue[i].nextTry = TimeCurrent() + (int)MathPow(2, queue[i].tries); // backoff 2,4,8,16s
      }
      if(done){ ArrayRemove(queue,i,1); i--; }
      else break;   // keep event order: stop until the head succeeds
   }
}

//--- scan open positions for opens, closes and SL/TP changes ---------
void Scan(bool silent)
{
   // closures
   for(int i=ArraySize(known)-1;i>=0;i--)
   {
      if(PositionSelectByTicket(known[i].ticket)) continue;
      double vol=0, price=0; string sym="";
      if(HistorySelectByPosition(known[i].ticket))
         for(int d=HistoryDealsTotal()-1; d>=0; d--)
         {
            ulong deal=HistoryDealGetTicket(d);
            long en=HistoryDealGetInteger(deal,DEAL_ENTRY);
            if(en==DEAL_ENTRY_OUT || en==DEAL_ENTRY_OUT_BY){ vol=HistoryDealGetDouble(deal,DEAL_VOLUME); price=HistoryDealGetDouble(deal,DEAL_PRICE); sym=HistoryDealGetString(deal,DEAL_SYMBOL); break; }
         }
      if(!silent && sym!="") Enqueue("close", known[i].ticket, sym, "", vol, price, 0, 0);
      ArrayRemove(known,i,1);
   }
   // opens and modifications
   for(int i=0;i<PositionsTotal();i++)
   {
      ulong t=PositionGetTicket(i); if(t==0) continue;
      string sym=PositionGetString(POSITION_SYMBOL);
      double sl=PositionGetDouble(POSITION_SL), tp=PositionGetDouble(POSITION_TP);
      int k=FindKnown(t);
      if(k<0)
      {
         int n=ArraySize(known); ArrayResize(known,n+1); known[n].ticket=t; known[n].sl=sl; known[n].tp=tp;
         if(!silent)
         {
            string side = PositionGetInteger(POSITION_TYPE)==POSITION_TYPE_BUY ? "buy" : "sell";
            Enqueue("open", t, sym, side, PositionGetDouble(POSITION_VOLUME), PositionGetDouble(POSITION_PRICE_OPEN), sl, tp);
         }
      }
      else if(known[k].sl!=sl || known[k].tp!=tp)
      {
         known[k].sl=sl; known[k].tp=tp;
         if(!silent) Enqueue("modify", t, sym, "", PositionGetDouble(POSITION_VOLUME), PositionGetDouble(POSITION_PRICE_OPEN), sl, tp);
      }
   }
}

void Show()
{
   Comment("NEXTRAPRO Master Sender\n",
           "Status: ", status, "\n",
           "Signals sent: ", signalsSent, "\n",
           "Pending: ", ArraySize(queue), "   Failed: ", failures, "\n",
           "Last success: ", (lastOk>0 ? TimeToString(lastOk, TIME_DATE|TIME_SECONDS) : "-"));
}

//--- events ----------------------------------------------------------
int OnInit()
{
   if(StringLen(ProviderToken)!=48){ Alert("NEXTRAPRO: paste your 48-character provider token"); return INIT_PARAMETERS_INCORRECT; }
   Scan(true);                 // existing positions are not re-sent on restart
   status = "Ready - waiting for trades";
   EventSetTimer(MathMax(1,TimerSeconds));
   Show();
   return INIT_SUCCEEDED;
}
void OnDeinit(const int reason){ EventKillTimer(); Comment(""); }
void OnTradeTransaction(const MqlTradeTransaction &t, const MqlTradeRequest &r, const MqlTradeResult &rs){ Scan(false); ProcessQueue(); Show(); }
void OnTimer(){ Scan(false); ProcessQueue(); Show(); }
void OnTick(){}
