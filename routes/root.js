const express = require('express')
const {checkTimings} = require('../controllers/puppeteer-check')
router = express.Router()

// User account page
router.post('/', checkTimings)
router.get('/', (req, res) => { res.sendStatus(403) })

module.exports = router
