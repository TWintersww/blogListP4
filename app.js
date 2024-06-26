const express = require('express')
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('Connecting to MDB')
mongoose.connect(config.MONGODB_URL)
    .then(response => {
        logger.info('Successful connection')
    })
    .catch(error => {
        logger.error('Connection failed:', error.message)
    })

    
const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
