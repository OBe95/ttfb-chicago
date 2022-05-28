const express = require('express')
const checkTimings = require('../controllers/puppeteer-check')
router = express.Router()

// User account page
router.post('/check', checkTimings.checkTimings)
router.get('/', (req, res) => { res.send('Should be fine') })

module.exports = router
