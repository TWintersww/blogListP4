const blogsRouter = require('express').Router()
// const { application } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
      return response.status(400).end()
    }

    // console.log(request.user)

    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user._id
    }

    const blog = new Blog(newBlog)

    const postedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(postedBlog._id)
    await request.user.save()
    response.status(201).json(postedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).json({error: 'blog not found'})
  }

  const user = request.user
  // console.log(user)

  if (blogToDelete.user.toString() === user._id.toString()) {
    // console.log('allow delete')
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    return response.status(204).end()
  }
  else {
    return response.status(401).json({error: "you don't have the authority to delete this blog"})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedNote = await Blog
    .findByIdAndUpdate(request.params.id, newBlog, {new: true})
  response.status(200).json(updatedNote)

})

module.exports = blogsRouter
