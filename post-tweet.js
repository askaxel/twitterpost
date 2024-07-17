const Twitter = require('twitter-lite');
const fetch = require('node-fetch');

async function fetchBTCPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
}

async function postTweet() {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_SECRET_KEY,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const currentPrice = await fetchBTCPrice();
    const salePrice = 58700;
    const btcSold = 50000;
    const totalSaleValue = salePrice * btcSold;
    const currentValue = currentPrice * btcSold;
    const potentialLoss = currentValue - totalSaleValue;

    const status = `📉 Germany's Bitcoin Regret Meter Update 📉\n\nAs of today, Germany potentially lost $${potentialLoss.toLocaleString()} by selling their BTC too soon. Check out the real-time tracker here: https://germanysbitcoinregretmeter.carrd.co/\n\n#Bitcoin #Crypto #Germany #BTC`;

    try {
        await client.post('statuses/update', { status });
        console.log('Tweet posted successfully');
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

postTweet();
