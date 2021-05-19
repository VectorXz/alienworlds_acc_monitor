// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import delay from 'delay'

export default async (req, res) => {
    const {
        query: { tx },
    } = req
    //console.log(tx)
    if(!tx || typeof tx == "undefined" || tx == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    await delay(getRandom(100,2000))
    await axios.get(`https://wax.eosrio.io/v2/history/get_transaction?id=${tx}`
    ).then((response) => {
        //console.log("TX RESP")
        //console.log(data)
        //console.log(data.actions[1].act.data.amount)
        return res.status(response.status).json(response.data)
    }).catch(async (err) => {
        console.log("EOSRIO ERR")
        console.log(err.response.status, err.response.statusText)
        await delay(getRandom(300,2000))
        return await axios.get(`https://wax.greymass.com/v1/history/get_transaction?id=${tx}`)
        .then((response) => res.status(response.status).json(response.data))
        .catch((err2) => {
            console.log("Fallback Greymass err")
            console.log(err2)
            return res.status(err2.response.status).json(err.response.data)
        })
    })
    // await axios.post('https://wax.pink.gg/v1/chain/get_account',
    // {
    //     "account_name": name,
    // }
    // ).then((response) => {
    //     //console.log(response)
    //     return res.status(response.status).json(response.data)
    // }).catch((err) => {
    //     console.log("ERROR get cpu data")
    //     console.log(err)
    //     return res.status(err.response.status).json(err.response.data)
    // })
}
