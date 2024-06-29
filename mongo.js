const mongoose = require('mongoose')
const Blog = require('./models/blog')
const User = require('./models/user')
const bcrypt = require('bcrypt')

if (process.argv.length < 3) {
    console.log('password as argument')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://wuevan33:${password}@cluster0.xkaympk.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => console.log('successful connection'))

// const newBlogPost = new Blog({
//     title: "Iphone 16 Secrets",
//     author: "Tim Cook",
//     url: "cookedtim.com",
//     likes: 6969
// })

// newBlogPost.save().then(result => {
//     console.log('blog post successfully saved')
//     mongoose.connection.close()
// })

bcrypt.hash("evwu", 10)
    .then(passwordHash => {
        console.log(passwordHash)
        const newUser = new User({
            username: "wuevan",
            name: "Evan Wu",
            passwordHash
        })
        return newUser.save()
    })
    .then(result => {
        console.log('new user successfullly saved')
        mongoose.connection.close()
    })

