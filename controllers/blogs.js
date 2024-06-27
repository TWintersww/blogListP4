const blogsRouter = require('express').Router()
const { application } = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).end()
    }

    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    const blog = new Blog(newBlog)

    const postedBlog = await blog.save()
    // console.log(result)
    response.status(201).json(postedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedPerson = await Blog.findByIdAndDelete(request.params.id)
  // console.log(deletedPerson)
  if (deletedPerson) {
    logger.info('deleted', deletedPerson)
  }
  else {
    logger.info('tried to delete nonexistent person')
  }
  response.status(204).end()
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
