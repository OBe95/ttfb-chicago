require('dotenv').config()
const PORT = process.env.PORT || 80
const express = require('express')
const cors = require('cors')
const app = express()
const allowCrossDomain = require('./headers/set-headers')

// Express App settings
app.disable('x-powered-by')
app.use(allowCrossDomain)
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
const rootUrl = require('./routes/root')

// Define main paths
app.use('/', rootUrl)

// Set app ports
app.listen(PORT, (err) => {
    if (err) return console.log(err)
    console.log('My Port Number', PORT)
})