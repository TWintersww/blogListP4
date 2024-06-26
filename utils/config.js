require('dotenv').config()

PORT = process.env.PORT
MONGODB_URL = process.env.MONGODB_URL

module.exports = {
    PORT,
    MONGODB_URL
}
