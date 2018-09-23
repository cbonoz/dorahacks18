const library = (function () {

    function formatDate(d) {
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`
    }

    return {
        formatDate
    }

})();
module.exports = library;

