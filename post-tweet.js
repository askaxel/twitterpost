const { TwitterApi } = require('twitter-api-v2');
const fetch = require('node-fetch');

async function fetchBTCPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        console.error('Error fetching BTC price:', error);
        throw error;
    }
}

async function postTweet() {
    const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET_KEY,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    try {
        const currentPrice = await fetchBTCPrice();
        const salePrice = 58700;
        const btcSold = 50000;
        const totalSaleValue = salePrice * btcSold;
        const currentValue = currentPrice * btcSold;
        const potentialLoss = currentValue - totalSaleValue;

        const status = `📉 Germany's Bitcoin Regret Meter Update 📉\n\nAs of today, Germany potentially lost $${potentialLoss.toLocaleString()} by selling their BTC too soon. Check out the real-time tracker here: https://germanysbitcoinregretmeter.carrd.co/\n\n#Bitcoin #Crypto #Germany #BTC`;

        console.log('Posting tweet:', status);

        await client.v2.tweet(status);
        console.log('Tweet posted successfully');
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

postTweet();
