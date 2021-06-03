const express = require('express')
const axios = require('./axios')


const router = express.Router()

const base_api = [
    'https://wax.greymass.com',
    'https://wax.cryptolions.io',
    'https://api.wax.alohaeos.com',
    'https://wax.blacklusion.io',
    'https://waxapi.ledgerwise.io',
]

const v2_api = [
    'https://api.wax.alohaeos.com',
    'https://wax.eu.eosamsterdam.net',
    'https://api.waxsweden.org',
    'https://wax.cryptolions.io'
]

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

router.get('/:tx', async (req, res) => {
    let tx = req.params.tx
    tx = tx.match(/\b[A-Fa-f0-9]{64}\b/g)
    if(!tx || typeof tx == "undefined" || tx == '') return res.status(400).send({msg: "Invalid Transacion ID."})
    tx = tx[0]
    let index = getRandom(0, base_api.length)
    const url = `${base_api[index]}/v1/history/get_transaction`
    console.log(url+` ${tx}`)
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`

    await axios.post(url,
    {
        id: tx
    },
    {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 15000
    })
    .then((resp) => {
        if(resp.data) {
            //console.log(resp.data)
            if(url=='https://wax.greymass.com/v1/history/get_transaction') {
                return res.status(200).send({
                    mined: parseFloat(resp.data.traces[1].act.data.quantity.slice(0, -4))
                })
            } else {
                return res.status(200).send({ mined: resp.data.traces[1].act.data.amount })
            }
        }
    })
    .catch(async (err) => {
        console.log(err.message)
        let indexv2 = getRandom(0, v2_api.length)
        const urlv2 = `${v2_api[indexv2]}/v2/history/get_transaction?id=${tx}`
        console.log(urlv2)
        await axios.get(urlv2, {
            headers: {
                timeout: 15000
            }
        })
        .then((resp) => {
            if(resp.data) {
                return res.status(200).send({ mined: resp.data.actions[1].act.data.amount })
            }
        })
        .catch((err2) => {
            return res.status(500).send(JSON.stringify(err2))
        })
    })
})

module.exports = router;