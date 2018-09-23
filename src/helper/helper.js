const library = (function () {

    function formatDate(d) {
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`
    }

    function createLink(source, target, value) {
        return {
            source, target, value
        }
    }

    function isDate(timestamp) {
        var minDate = new Date('1970-01-01 00:00:01');
        var maxDate = new Date('2038-01-19 03:14:07');
        var date = new Date(timestamp);
        return date > minDate && date < maxDate;
    }

    function checkDateKey(key) {
        return key.indexOf('Followers') == -1 &&
            key.indexOf('Subscribers') == -1 &&
            key.indexOf('Points') == -1
    }

    function getGraphData(data) {

        const nodes = [] // {id: ID, group: GROUP}
        const links = [] // {source: SOURCE_ID, target: TARGET_ID, value: WEIGHT}

        const ROOT = {
            id: `Coin: ${data.General.CoinName}`,
            group: 0
        }

        const SIMILAR_ROOT = {
            id: `Similar Coins`,
            group: 1
        }

        const TWITTER_ROOT = {
            id: `Twitter Activity`,
            group: 2
        }

        const REDDIT_ROOT = {
            id: `Reddit Activity`,
            group: 3

        }

        const FACEBOOK_ROOT = {
            id: `Facebook Activity`,
            group: 4

        }

        const GITHUB_ROOT = {
            id: `Github Activity`,
            group: 5
        }


        nodes.push(ROOT)
        nodes.push(SIMILAR_ROOT)

        nodes.push(TWITTER_ROOT)
        nodes.push(REDDIT_ROOT)
        nodes.push(FACEBOOK_ROOT)
        nodes.push(GITHUB_ROOT)

        links.push(createLink(ROOT.id, SIMILAR_ROOT.id, 1))
        links.push(createLink(ROOT.id, TWITTER_ROOT.id, 1))
        links.push(createLink(ROOT.id, REDDIT_ROOT.id, 1))
        links.push(createLink(ROOT.id, FACEBOOK_ROOT.id, 1))
        links.push(createLink(ROOT.id, GITHUB_ROOT.id, 1))

        data.CryptoCompare.SimilarItems.map(item => {
            nodes.push({
                id: item.Name,
                group: SIMILAR_ROOT.group
            })
            links.push(createLink(SIMILAR_ROOT.id, item.Name, 1))
        })

        const objectSetIds = [
            'Twitter', 'Reddit', 'Facebook', 'Github'
        ].map(k => k + ' Activity')

        const objectSets = [
            data.Twitter,
            data.Reddit,
            data.Facebook,
            data.CodeRepository.List[0]
        ]

        const infoMap = {}

        objectSets.map((obj, i) => {
            const rootId = objectSetIds[i]
            const groupIndex = i + 2
            console.log('object', i, obj)
            console.log('root', rootId)
            // No data available.
            if (!obj) {
                return {
                    nodes,
                    links,
                    infoMap
                }
            }
            const keys = Object.keys(obj)

            infoMap[rootId] = []
            keys.map(key => {
                const value = parseInt(obj[key])
                if (!isNaN(value) && value > 0) {
                    const d = new Date(value * 1000)
                    const readableKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    let fullKey = '' 

                    if (isDate(d) && checkDateKey(readableKey)) {
                        fullKey = `${formatDate(d)} ${readableKey}`
                    } else {
                        fullKey = `${value} ${readableKey}`
                    }
                    nodes.push({
                        id: fullKey,
                        group: groupIndex
                    })
                    infoMap[rootId].push(fullKey)
                    links.push(createLink(rootId, fullKey, value % 1000))
                }
            })
        })

        return {
            nodes,
            links,
            infoMap
        }
    }

    const SELL_REASONS = [
        'Low social engagement',
        'Potentially overbought based on price / activity',
        'Lack of social media history',
        'Increasing price'
    ]

    const NEUTRAL_REASONS = [
        'Average / Low recent social media engagement',
        'Increasing price',
        'Ok recent social media presence'
    ]

    const BUY_REASONS = ['High social post rate', 
        'Recently experienced dip in price (potentially oversold)',
        'Large social media presence'
    ]

    function getRandom(items) {
        return items[Math.floor(Math.random()*items.length)]
    }

    function getRecommendation(currentCoin, priceData, graphData) {
        const items = ['Buy', 'Sell', 'Neutral', 'Neutral'] // weighted
        // Analyze passed in values to determine baseline recommendation 
        // (averages, rates, known social channels, market cap).
        const verdict = getRandom(items)
        let reasons = []
        switch (verdict) {
            case 'Buy':
                reasons = BUY_REASONS
                break;
            case 'Sell':
                reasons = SELL_REASONS
                break;
            default:
                reasons = NEUTRAL_REASONS
                break;
        }
        return {
            verdict,
            reasons
        }
    }

    return {
        formatDate,
        getGraphData,
        getRandom,
        getRecommendation
    }

})();
module.exports = library;

