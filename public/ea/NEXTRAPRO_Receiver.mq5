//+------------------------------------------------------------------+
//| NEXTRAPRO Receiver EA - runs on the CLIENT's MT5 (PC or VPS)      |
//| Copies the mentor's trades using the client's licence risk.       |
//| MT5: Tools > Options > Expert Advisors > Allow WebRequest for:    |
//|      https://nextra-pro-trader.lovable.app                        |
//+------------------------------------------------------------------+
#property strict
#include <Trade/Trade.mqh>
input string ServerUrl  = "https://nextra-pro-trader.lovable.app";
input string LicenceKey = "";   // NXP-XXXX-XXXX-XXXX-XXXX
input int    PollSeconds = 2;
input long   Magic = 778899;

CTrade trade;
long   lastId = 0;
string riskMode = "fixed"; double riskValue = 0.01; int maxPerDay = 0; bool enabled = true;

int OnInit()
{
   if(StringLen(LicenceKey) < 10) { Alert("NEXTRAPRO: enter your licence key"); return INIT_PARAMETERS_INCORRECT; }
   lastId = (long)GlobalVariableGet("NXP_LAST_"+LicenceKey);
   trade.SetExpertMagicNumber(Magic);
   EventSetTimer(MathMax(1, PollSeconds));
   return INIT_SUCCEEDED;
}
void OnDeinit(const int r) { EventKillTimer(); }

double LotFor(string sym, double mentorLot, double price, double sl)
{
   double lot = mentorLot;
   if(riskMode=="fixed") lot = riskValue;
   else if(riskMode=="multiplier") lot = mentorLot * riskValue;
   else if(riskMode=="percent" && sl>0)
   {
      double riskMoney = AccountInfoDouble(ACCOUNT_BALANCE) * riskValue / 100.0;
      double tv = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE), ts = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_SIZE);
      double dist = MathAbs(price - sl);
      if(tv>0 && ts>0 && dist>0) lot = riskMoney / (dist/ts*tv);
   }
   double step = SymbolInfoDouble(sym, SYMBOL_VOLUME_STEP), mn = SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN), mx = SymbolInfoDouble(sym, SYMBOL_VOLUME_MAX);
   lot = MathFloor(lot/step)*step;
   return MathMax(mn, MathMin(mx, lot));
}

ulong FindCopy(ulong mentorTicket)
{
   string tag = "NXP#"+(string)mentorTicket;
   for(int i=PositionsTotal()-1;i>=0;i--)
   {
      ulong p = PositionGetTicket(i);
      if(PositionSelectByTicket(p) && PositionGetInteger(POSITION_MAGIC)==Magic && PositionGetString(POSITION_COMMENT)==tag) return p;
   }
   return 0;
}

int TradesToday()
{
   MqlDateTime d; TimeCurrent(d); d.hour=0; d.min=0; d.sec=0;
   HistorySelect(StructToTime(d), TimeCurrent());
   int n=0;
   for(int i=HistoryDealsTotal()-1;i>=0;i--){ ulong t=HistoryDealGetTicket(i);
      if(HistoryDealGetInteger(t,DEAL_MAGIC)==Magic && HistoryDealGetInteger(t,DEAL_ENTRY)==DEAL_ENTRY_IN) n++; }
   return n;
}

void Handle(string &f[])
{
   string action=f[2]; ulong mt=(ulong)StringToInteger(f[3]); string sym=f[4]; string side=f[5];
   double vol=StringToDouble(f[6]), price=StringToDouble(f[7]), sl=StringToDouble(f[8]), tp=StringToDouble(f[9]);
   if(!SymbolSelect(sym,true)) { Print("NEXTRAPRO: symbol not found ", sym); return; }
   if(action=="open")
   {
      if(!enabled || FindCopy(mt)>0) return;
      if(maxPerDay>0 && TradesToday()>=maxPerDay) { Print("NEXTRAPRO: daily limit reached"); return; }
      double lot = LotFor(sym, vol, price, sl);
      string tag = "NXP#"+(string)mt;
      if(side=="buy") trade.Buy(lot, sym, 0, sl, tp, tag); else trade.Sell(lot, sym, 0, sl, tp, tag);
   }
   else if(action=="close") { ulong p=FindCopy(mt); if(p>0) trade.PositionClose(p); }
   else if(action=="modify"){ ulong p=FindCopy(mt); if(p>0) trade.PositionModify(p, sl, tp); }
}

void OnTimer()
{
   char data[], res[]; string rh;
   string url = ServerUrl+"/api/public/ea/poll?key="+LicenceKey+"&after="+(string)lastId;
   int code = WebRequest("GET", url, "", 5000, data, res, rh);
   if(code!=200) { Print("NEXTRAPRO poll ", code, " ", CharArrayToString(res)); return; }
   string lines[]; int n = StringSplit(CharArrayToString(res), '\n', lines);
   for(int i=0;i<n;i++)
   {
      string f[]; int c = StringSplit(lines[i], '|', f);
      if(c>=5 && f[0]=="RISK") { riskMode=f[1]; riskValue=StringToDouble(f[2]); maxPerDay=(int)StringToInteger(f[3]); enabled=f[4]=="1"; }
      else if(c>=2 && f[0]=="LAST") lastId=StringToInteger(f[1]);
      else if(c>=10 && f[0]=="S") { Handle(f); lastId=StringToInteger(f[1]); }
   }
   GlobalVariableSet("NXP_LAST_"+LicenceKey, (double)lastId);
}
