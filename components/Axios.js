import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import axiosRetry from 'axios-retry';

const http = rateLimit(axios.create(), { maxRequests: 20, perMilliseconds: 1000, maxRPS: 20 })

axiosRetry(http, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

console.log("USER MAX RPS: "+http.getMaxRPS())

export default http;