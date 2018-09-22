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

    return {
        getCoins,
        getCoinInfo,
        getCoinPrices
    }

})();
module.exports = library;

