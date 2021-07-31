const fetch = require('node-fetch')


// get coin details
// https://api.coincap.io/v2/assets
const capitalizeFirstLetter = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

module.exports.getCoinDetails = (coin) => {
  const coinName = capitalizeFirstLetter(coin.trim())

  return fetch('https://api.coincap.io/v2/assets')
    .then(res => res.json())
    .then(data => {
        const coins = data.data;
        const details = coins.find(coin => coin.name === coinName)
        if(!details){
            throw Error();
        }
        return details;
    })
    .catch( err =>{
        return new Promise((resolve, reject) => reject(`"${coinName}" coin not found. Please enter valid coin name.`));
    })
}


// https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/jpy.json
module.exports.getCurrencyExchangeRate = (currency)=>{

  return fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`)
    .then(response => response.json())
    .then(rate => {
        return rate;
    })
     .catch(err=>{
        return new Promise((resolve, reject) => reject(`"${currency}" is a Invalid currency. Please enter valid currency.`));
    })
}
   



module.exports.getTrendingCoins = async () => {
    try{
        const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const data = await response.json(); 
        return data.coins

    }catch(err){
        return new Promise((resolve, reject)=>reject('Opps! Server error :('))
    }
}

module.exports.getHelpText = ()=> `I support 4 commands:
    \n>ping  -To check if bot is responding
    \n>help  -To show all available commands
    \n>show <coin_name>  -To show coin details. Example: >show bitcoin
    \n>price <coin_name> <currency>  -Get price of a coin with respect to currency. Example: >price bitcoin usd
    \n>show trending  -Show top searched coins in last 24hr
    `













