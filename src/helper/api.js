const library = (function () {
    const axios = require('axios')
    const BASE_URL = "https://www.cryptocompare.com"


    function getCoins() {
        return axios.get(`https://cors-anywhere.herokuapp.com/${BASE_URL}/api/data/coinlist/`)
    }

    function getCoinInfo(coinId) {
        return axios.get(`https://cors-anywhere.herokuapp.com/${BASE_URL}/api/data/socialstats/?id=${coinId}`)
    }

    function getCoinPrices(coinSymbol) {
        return axios.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${coinSymbol}&tsym=USD&limit=14&aggregate=3&e=CCCAGG`)
    }

    function getCachedCoins() {
        return axios.get(`https://raw.githubusercontent.com/cbonoz/dorahacks18/master/src/assets/coins.json`)
    }

    return {
        getCoins,
        getCoinInfo,
        getCoinPrices,
        getCachedCoins,
    }

})();
module.exports = library;

