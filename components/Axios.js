import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const http = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000 })
console.log("USER MAX RPS: "+http.getMaxRPS())

export default http;