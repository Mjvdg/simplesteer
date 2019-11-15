function isYoung(history) {
    return (history.date.getTime() + 2 * 60 * 1000) > new Date().getTime();
}

module.exports = isYoung;