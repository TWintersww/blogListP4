const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title:"Anti Trans Stuff",
        author:"JK Rowling",
        url:"https://radfem.com",
        likes:32
    },
    {
        title:"Iphone 16 Secrets",
        author:"Tim Cook",
        url:"cookedtim.com",
        likes:6969
    }
]

const initialUsers = [
    {
        username: "evwu05",
        name: "Evan Wu",
        password: "evwu"
    },
    {
        username: "emperorspriggan",
        name: "Zeref",
        password: "evwu"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb
}
