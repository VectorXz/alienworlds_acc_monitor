import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const http = rateLimit(axios.create(), { maxRequests: 12, perMilliseconds: 1000 })
console.log("SERVER MAX RPS: "+http.getMaxRPS())

export default http;