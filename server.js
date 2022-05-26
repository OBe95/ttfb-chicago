require('dotenv').config()
const PORT = process.env.PORT || 80
const express = require('express')
const app = express()

// Express App settings
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
const rootUrl = require('./routes/root')

// Define main paths
app.use('/', rootUrl)

// Set app ports
app.listen(PORT, (err) => {
    if (err) return console.log(err)
    console.log('My Port:', PORT)
})