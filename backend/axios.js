const axios = require('axios')
const rateLimit = require('axios-rate-limit')

const http = rateLimit(axios.create(), { maxRequests: 200, perMilliseconds: 1000, maxRPS: 200 })

console.log("Server Axios RPS: "+http.getMaxRPS())

module.exports = http;