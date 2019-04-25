function checkSentiment(score) {
    if (score >= 0.05) {
        return 'Good Post'
    } else if (score > -0.05 && score < 0.05) {
        return 'Neutral Post'
    } else {
        return 'Negative Post'
    }
}
module.exports = checkSentiment