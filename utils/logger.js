const info = (...args) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...args)

    }
}

const error = (...args) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...error)

    }
}

module.exports = {
    info,
    error
}
