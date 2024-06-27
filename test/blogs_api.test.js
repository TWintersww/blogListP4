const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


describe('when there are initial blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blogObj => blogObj.save())
        await Promise.all(promiseArray)
    })

    describe('get tests', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
        test('there are 2 blogs in db after get request', async () => {
            const response = await api.get('/api/blogs')
        
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })
        test('id is a property of returned blog object', async () => {
            const response = await api.get('/api/blogs')
            const firstBlog = response.body[0];
            // console.log(firstBlog)
            assert('id' in firstBlog)
        })
    })

    describe('post tests', () => {
        test('post request works', async () => {
            const newBlog = {
                title:"I make bombs",
                author:"Osama Bin Laden",
                url:"https://alqaeda.com",
                likes:400
            }
        
            const returnedBlog = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const finalBlogs = await helper.blogsInDb()
            const titles = finalBlogs.map(blog => blog.title)
        
            assert.strictEqual(finalBlogs.length, helper.initialBlogs.length + 1)
            assert(titles.includes(newBlog.title))
        })
        test('posting without likes defaults to 0', async () => {
            const blogWithoutLikes = {
                title:"I'm lonely",
                author:"Taylor Swift",
                url:"https://swifty.com"
            }
        
            const returnedBlog = await api
                .post('/api/blogs')
                .send(blogWithoutLikes)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            assert.strictEqual(returnedBlog.body.likes, 0)
        })
        test('posting without title or url returns status 400', async () => {
            const blogWithoutTitle = {
                author:"Brock Obama",
                url:"Broccoli.com",
                likes:20
            }
            const blogWithoutURL = {
                title:"Epstein Island",
                author:"Jeffrey Epstein",
                likes:20
            }
        
            await api
                .post('/api/blogs')
                .send(blogWithoutTitle)
                .expect(400)
            await api
                .post('/api/blogs')
                .send(blogWithoutURL)
                .expect(400)

            const finalBlogs = await helper.blogsInDb()
            assert.strictEqual(finalBlogs.length, helper.initialBlogs.length)
        })
    })

    describe('delete tests', () => {
        test('delete existing blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)
            
            const blogsAtEnd = await helper.blogsInDb()
            const blogsAtEndTitles = blogsAtEnd.map(blog => blog.title)
            // console.log(blogsAtEndTitles)

            assert(!blogsAtEndTitles.includes(blogToDelete.title))
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })
    })

    describe('put tests', () => {
        test('update blog with 10 more likes', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const firstBlog = blogsAtStart[0]

            const blogWithUpdatedLikes = {
                title: firstBlog.title,
                author: firstBlog.author,
                url: firstBlog.url,
                likes: firstBlog.likes + 10
            }
            
            await api
                .put(`/api/blogs/${firstBlog.id}`)
                .send(blogWithUpdatedLikes)
                .expect(200)

            const updatedBlog = await Blog.findById(firstBlog.id)
            
            assert.strictEqual(updatedBlog.likes, blogWithUpdatedLikes.likes)
        })
    })
    

})

after(async () => {
    await mongoose.connection.close()
})
