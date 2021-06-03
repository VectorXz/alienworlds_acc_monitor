const axios = require('axios')
const rateLimit = require('axios-rate-limit')
const axiosRetry = require('axios-retry')

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const http = rateLimit(axios.create(), { maxRequests: 200, perMilliseconds: 1000, maxRPS: 200 })

console.log("Server Axios RPS: "+http.getMaxRPS())

module.exports = http;