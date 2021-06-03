import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const http = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 })
console.log("USER MAX RPS: "+http.getMaxRPS())

export default http;