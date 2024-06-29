const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const allUsers = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})
    response.json(allUsers)
})
usersRouter.post('/', async (request, response, next) => {
    const {username, name, password} = request.body 

    //handle invalid params
    if (!username || !password) {
        return response.json({error: "username or password missing"})
    }
    if (username.length < 3 || password.length < 3) {
        return response.json({error: "username and password must be at least length 3"})
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save()
    // console.log('user successfully saved', savedUser)
    response.status(201).json(savedUser)
})

module.exports = usersRouter
