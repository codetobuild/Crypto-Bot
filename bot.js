const {Client} = require('discord.js')
const dotenv = require('dotenv')
const fetch = require('node-fetch')


// fetch api methods 
const {
    getCurrencyExchangeRate, 
    getCoinDetails, 
    getTrendingCoins, 
    getHelpText,
    } = require('./controllers/methods')

dotenv.config();

// create bot instance
const bot = new Client();

// login the bot
bot.login(process.env.DISCORD_BOT_TOKEN);

// check if bot is ready
bot.on('ready', () => {
    console.log(`${bot.user.username} is up and running`)
})

// listen to messages
bot.on('message', (message) => {
    // do not reply if message was sent by bot
    if(message.author.bot)return ;
    console.log(message.content);
    let [command, ...args] = message.content.trim().split(' ');
    command = command.slice(1);
    args = args.filter(word => word!='')

    // command controller
    if(args.length === 0){
        switch(command){
            case 'ping': replyPing(); break;
            case 'help': replyHelp(); break;
        }
    }else if( args.length === 1){
        switch(command){
            case 'show': 
                if(args[0]==='trending'){
                    replyTrending();
                }else{
                    replyCoinDetails(args);
                }
                break;
            default: replyInvalidCommand();
        }
    }else if(args.length === 2){
        switch(command){
            case 'price': 
                replyCoinPrice(args);
                break;
            default: replyInvalidCommand();
        }
    }

// reply coin details
    async function replyCoinDetails(args){
        try{
            const res = await getCoinDetails(args[0]);
            console.log(res)
            const sendCoin = `symbol: ${res.symbol}
                    \nname: ${res.name}
                    \nPrice in USD: ${Number(res.priceUsd).toFixed(4)}
                    \nmarket Cap in USD: ${Number(res.marketCapUsd).toFixed(4)}
                    \nCirculating supply: ${Number(res.supply).toFixed()}
                    \nSupply limit: ${Number(res.maxSupply).toFixed()}
                    \nchange Percent in 24Hr: ${res.changePercent24Hr}`

            message.channel.send(sendCoin);
        }catch(err){
            replyInvalidCommand(err)
        }
    }

// reply coin price
    async function replyCoinPrice(args) {
        const [coin, currency] = args;
        try{
            const coinData = await getCoinDetails(coin);
            const usdPrice = Number.parseFloat(coinData.priceUsd);
            console.log(coinData)

            let {[currency]:price} = await getCurrencyExchangeRate(currency);
            price = (price * usdPrice).toFixed(4);

            message.channel.send(`${coinData.name}  ${price} ${currency}`)
         
        }catch(err){
           replyInvalidCommand(err);
        }
    }

// reply to invalid command
    function replyInvalidCommand(err=null){
        if(err){
            message.reply(err)
        }else{
           message.reply('Please enter valid command.\nCommand for help:  >help');
        }
    }

// check if bot is responding
    function replyPing(){
        message.channel.send('pong! I am Crypto Bot.\nType: ">help" for help(without double quotes)') ;
    }

// reply help commands
    function replyHelp(){
        message.channel.send(getHelpText());
        return;
    }

// reply trending coins
   async function replyTrending(){
        try{
            const coins = await getTrendingCoins();
            let tCoin = 'Top-7 trending coins searched by users in the last 24 hours:\n'
            coins.forEach(coin => {
                tCoin +=coin.item.name+', '
            })
          message.channel.send(tCoin)
          
        }catch(err){
            replyInvalidCommand(err);
        }
    }
}) 







