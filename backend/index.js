const express = require('express')
const cors = require('cors')
const get_account = require('./get_account')
const get_tlm = require('./get_tlm')
const get_tag = require('./get_tag')
const get_lastmine = require('./get_lastmine')
const get_tx = require('./get_tx')
const check_nft = require('./check_nft')

const app = express()
const port = 3003

app.use(cors())
app.use('/get_account', get_account)
app.use('/get_tlm', get_tlm)
app.use('/get_tag', get_tag)
app.use('/get_lastmine', get_lastmine)
app.use('/get_tx', get_tx)
app.use('/check_nft', check_nft)

app.get('/', (req, res) => {
  res.send('Alienworlds.fun API')
})

app.listen(process.argv[2] || process.env.PORT || port, () => {
    console.log(`App is listening at ${process.argv[2] || process.env.PORT || port}`);
});