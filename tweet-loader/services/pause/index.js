module.exports = sleepTime => {
    return new Promise(resolve => {
        setTimeout(resolve, sleepTime);
    })
}