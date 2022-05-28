const puppeteer = require('puppeteer')
const express = require("express");
router = express.Router()

const checkTimings = async (req, res) => {

    // Initial launch of browser
    let browser
    let location = 'Chicago'

    // Define the url to check
    let urlCheck = req.body.urlValue
    let finalResults = ''
    let finalPayload = []

    // Do the TTFB Checks
    try {
        // Start Puppeteer
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250
        })

        // Open new page
        const page = await browser.newPage()

        // Set the headers
        await page.setExtraHTTPHeaders({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
            'upgrade-insecure-requests': '1',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,en;q=0.8'
        })

        // Fetch th given URL
        await page.goto(urlCheck)

        // Get performance entries
        const rawPerfEntries = await page.evaluate(function () {
            return JSON.stringify(window.performance.getEntries())
        })

        // Parsing the performance entries results
        const performanceMetrics = JSON.parse(rawPerfEntries)
        console.log('rawPerfEntries', performanceMetrics[0])

        // Calculate the TTFB
        const firstByte = (performanceMetrics[0].responseStart - performanceMetrics[0].requestStart).toFixed()

        // Measuring DNS lookup time
        const dnsLookup = (performanceMetrics[0].connectStart - performanceMetrics[0].fetchStart)

        // Initial connection
        const connectTime = performanceMetrics[0].secureConnectionStart - performanceMetrics[0].connectStart

        // SSL handshake
        const sslHandshake = (performanceMetrics[0].connectEnd - performanceMetrics[0].secureConnectionStart)

        // Just a compare that can be deleted
        if (performanceMetrics[0].domainLookupEnd === performanceMetrics[0].domainLookupStart) console.log('Same')

        // Collate final results
        finalResults = {
            ipArea: location,
            DNS: Number(dnsLookup.toFixed(3)),
            Connect: Number(connectTime.toFixed(2)),
            SSL: Number(sslHandshake.toFixed(2)),
            TTFB: Number(firstByte)
        }

        console.log('FinalResults', typeof finalResults, finalResults)

        // Add to object
        finalPayload.push(finalResults)

        console.log('finalPayload top', finalPayload)

    } catch (err) {
        console.log('err', err)
        await browser.close()
        return res.json({error: err})

    } finally {
        // Log checks
        // console.log('finalPayload', JSON.stringify(finalPayload))
        // Send response payload
        res.json(finalPayload)
        // res.json({success: 'true'})

        await browser.close()
        console.log('Browser was closed')
    }
}

// Test post endpoint
const postTest = async (req, res) => {
    let testValue = req.body.urlValue
    let responseCheck = {
        "testKey": testValue
    }
    res.json(responseCheck)
}

module.exports = {checkTimings, postTest}