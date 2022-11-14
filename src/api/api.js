const API_KEAY='9c3d84168aea47d68992b547ec87656845c17a9813635ebf73ee23d311a7a3d2'

  const handlers=new Map()
const socker=new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEAY}`)
socker.addEventListener('message',e=>{

    const {TYPE:type,FROMSYMBOL:currentTicker,PRICE:Newprice}=JSON.parse(e.data)
  //  console.log(dataContent)
    if(type!="5"||Newprice==undefined)
    {
        return
    }
    const InHandlers=handlers.get(currentTicker)??[]
    InHandlers.forEach(cb=>{cb(Newprice)})
})

function  sendToTicketWsMessage(tickerName){
    const message=JSON.stringify({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${tickerName}~USD`]
    })
    if(socker.readyState==WebSocket.OPEN) {
        socker.send(message)
    }
    socker.addEventListener('open',()=>{
        socker.send(message)
    },{once:true})
}

export const subscribeToTickers=(ticker,cb)=>{
    const subscribers=handlers.get(ticker) || []
    handlers.set(ticker,[...subscribers,cb])
    sendToTicketWsMessage(ticker)
}
/*export const unsubscribeTicker=(ticker,cb)=>{
    const subscribers=handlers.get(ticker) || []
    handlers.set(ticker,subscribers.filter(s=>s!=cb))
}*/
function deleteTickerFromWS(tickerName){
    const message=JSON.stringify({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${tickerName}~USD`]
    })
    if(socker.readyState==WebSocket.OPEN) {
        socker.send(message)
    }
    socker.addEventListener('open',()=>{
        socker.send(message)
    },{once:true})
}
export const unsubscribeTicker=(ticker)=>{
  handlers.delete(ticker)
    deleteTickerFromWS(ticker)
}
window.handlers=handlers
//setInterval(loadTickers,5000)

    /*export const loadTickers=tickers=>
/*const loadTickers=()=>{
    if(handlers.size==0) {return}
 fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...handlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEAY}`).
 then(res=>res.json())
     .then(row=> {
        // console.log(row)
         const LoadTickersPrice= Object.fromEntries(
             Object.entries(row).map(([key, val]) => [key, val.USD])

         )
         Object.entries(LoadTickersPrice).forEach(([currency,price])=>{
             const InHandlers=handlers.get(currency)??[]
             InHandlers.forEach(cb=>{cb(price)})
         })
       //  console.log(LoadTickersPrice)
     }
)}*/