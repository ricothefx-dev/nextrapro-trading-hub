//+------------------------------------------------------------------+
//| NEXTRAPRO Sender EA - runs on the MENTOR's MT5                    |
//| Sends every open / close / modify to the NEXTRAPRO app.           |
//| MT5: Tools > Options > Expert Advisors > Allow WebRequest for:    |
//|      https://nextra-pro-trader.lovable.app                        |
//+------------------------------------------------------------------+
#property strict
input string ServerUrl = "https://nextra-pro-trader.lovable.app";
input string EaToken   = "";   // Bot EA token from the dashboard

void Send(string action, ulong ticket, string symbol, string side, double vol, double price, double sl, double tp)
{
   string body = "action="+action+"&ticket="+(string)ticket+"&symbol="+symbol;
   if(side!="") body += "&side="+side;
   body += "&volume="+DoubleToString(vol,2)+"&price="+DoubleToString(price,8)+"&sl="+DoubleToString(sl,8)+"&tp="+DoubleToString(tp,8);
   char data[], res[]; string resHeaders;
   StringToCharArray(body, data, 0, StringLen(body));
   string headers = "Content-Type: application/x-www-form-urlencoded\r\nx-ea-token: "+EaToken+"\r\n";
   int code = WebRequest("POST", ServerUrl+"/api/public/ea/signal", headers, 5000, data, res, resHeaders);
   Print("NEXTRAPRO ", action, " #", ticket, " ", symbol, " -> ", code, " ", CharArrayToString(res));
}

int OnInit()
{
   if(StringLen(EaToken)!=48) { Alert("NEXTRAPRO: paste your 48-character EA token"); return INIT_PARAMETERS_INCORRECT; }
   return INIT_SUCCEEDED;
}

void OnTradeTransaction(const MqlTradeTransaction &t, const MqlTradeRequest &r, const MqlTradeResult &rs)
{
   if(t.type==TRADE_TRANSACTION_DEAL_ADD && HistoryDealSelect(t.deal))
   {
      long entry = HistoryDealGetInteger(t.deal, DEAL_ENTRY);
      ulong pos  = (ulong)HistoryDealGetInteger(t.deal, DEAL_POSITION_ID);
      string sym = HistoryDealGetString(t.deal, DEAL_SYMBOL);
      double vol = HistoryDealGetDouble(t.deal, DEAL_VOLUME);
      double pr  = HistoryDealGetDouble(t.deal, DEAL_PRICE);
      if(entry==DEAL_ENTRY_IN)
      {
         string side = HistoryDealGetInteger(t.deal, DEAL_TYPE)==DEAL_TYPE_BUY ? "buy" : "sell";
         double sl=0, tp=0;
         if(PositionSelectByTicket(pos)) { sl=PositionGetDouble(POSITION_SL); tp=PositionGetDouble(POSITION_TP); }
         Send("open", pos, sym, side, vol, pr, sl, tp);
      }
      else if(entry==DEAL_ENTRY_OUT || entry==DEAL_ENTRY_OUT_BY)
         Send("close", pos, sym, "", vol, pr, 0, 0);
   }
   if(t.type==TRADE_TRANSACTION_POSITION && PositionSelectByTicket(t.position))
      Send("modify", t.position, PositionGetString(POSITION_SYMBOL), "", PositionGetDouble(POSITION_VOLUME),
           PositionGetDouble(POSITION_PRICE_OPEN), t.price_sl, t.price_tp);
}
