const Blog = require('../models/blog')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb
}
