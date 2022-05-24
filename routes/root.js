const express = require('express')
const {checkTimings} = require('../controllers/puppeteer-check')
router = express.Router()

// User account page
router.post('/', checkTimings)

module.exports = router
