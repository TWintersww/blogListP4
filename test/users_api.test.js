const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)


describe('save initialUsers', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const userObjects = await Promise.all(helper.initialUsers.map(async user => {
            const passwordHash = await bcrypt.hash(user.password, 10)
            return new User({
                username: user.username, 
                name: user.name, 
                passwordHash
            })
        }))
        // console.log(userObjects)
        const promiseArray = userObjects.map(userObject => userObject.save())
        await Promise.all(promiseArray)
    })

    test('valid user gets added', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Donald Trump",
            username: "magamaga",
            password: "evwu"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        const userNames = usersAtEnd.map(user => user.username)

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        assert(userNames.includes(newUser.username))
    })
    test('add user with missing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Hilary Clinton",
            password: "evwu"
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
        // console.log(response)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert.strictEqual(response.body.error, "username or password missing")
    })
    test('add user with invalid password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Hilary Clinton",
            username: "myemails",
            password: "a"
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
        // console.log(response)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert.strictEqual(response.body.error, "username and password must be at least length 3")
    })
    test('try to add duplicate username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: "randomname",
            username: "evwu05",
            password: "randompassword"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb();
        // console.log(result.body)

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(result.body.error.includes('expected username to be unique'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
