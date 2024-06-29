const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.info(error.message)
    // console.log(error.message)
    // console.log(error.name)

    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({error: 'expected username to be unique'})
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: 'token invalid'})
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    // console.log(token, 'from userExtractor')
    const userTokenObj = jwt.verify(token, process.env.SECRET)
    // console.log(userTokenObj)
    const theUser = await User.findById(userTokenObj.id)
    request.user = theUser

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}
