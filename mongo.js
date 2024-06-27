const mongoose = require('mongoose')
const Blog = require('./models/blog')

if (process.argv.length < 3) {
    console.log('password as argument')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://wuevan33:${password}@cluster0.xkaympk.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => console.log('successful connection'))

const newBlogPost = new Blog({
    title: "Iphone 16 Secrets",
    author: "Tim Cook",
    url: "cookedtim.com",
    likes: 6969
})

newBlogPost.save().then(result => {
    console.log('blog post successfully saved')
    mongoose.connection.close()
})
