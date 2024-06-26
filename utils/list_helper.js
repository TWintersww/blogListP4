const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => {
        return acc + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const favoriteBlog = blogs.reduce((currFav, blog) => {
        return (blog.likes > currFav.likes) ? blog : currFav
    }, blogs[0])

    const {_id, __v, url, ...parsedBlog} = favoriteBlog
    return parsedBlog
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const map = {}
    for (const blog of blogs) {
        if (blog.author in map) {
            map[blog.author]++
        }
        else {
            map[blog.author] = 1
        }
    }

    const maxAuthor = Object.entries(map).reduce((best, [author, blogs]) => {
        return (blogs > best.blogs) ? {author, blogs} : best
    }, {author: null, blogs: -1})
    return maxAuthor
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const map = {}
    for (const blog of blogs) {
        if (blog.author in map) {
            map[blog.author] += blog.likes
        }
        else {
            map[blog.author] = blog.likes
        }
    }

    // console.log(map)

    const maxAuthor = Object.entries(map).reduce((best, [author, likes]) => {
        return (likes > best.likes) ? {author, likes} : best
    }, {author: null, likes: -99999})
    return maxAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
