const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body
    const person = await User.findOne({username})
    const correctPassword = person === null
        ? false
        : await bcrypt.compare(password, person.passwordHash)

    if (!(person && correctPassword)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: person.username,
        id: person._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({token, username: person.username, name: person.name})
})

module.exports = loginRouter
