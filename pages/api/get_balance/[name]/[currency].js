// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    const {
        query: { name, currency },
    } = req
    console.log(`/get_balance/${currency} called`)
    //console.log(name, currency)
    if(!name || name == '' || typeof name == 'undefined' || !currency
    || typeof currency == 'undefined') {
        return res.status(400).send("Bad Request")
    }
    if(!['TLM','WAX'].includes(currency.toUpperCase())) {
        return res.status(400).send("Bad Request: Invalid Currency")
    }

    const code = currency.toUpperCase()==="TLM" ? "alien.worlds" : "eosio.token"
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    await delay(getRandom(100,2000))
    await axios.post('https://wax.pink.gg/v1/chain/get_currency_balance',
    {
        "code": code,
        "account": name,
        "symbol": currency.toUpperCase()
    }
    ).then((response) => {
        //console.log(response)
        if(response.data[0]) {
            return res.status(response.status).json(response.data)
        } else {
            return res.status(500).send({ code: 500, message: "Balance is empty" })
        }
    }).catch((err) => {
        console.log("ERROR get balance")
        console.log(err)
        return res.status(err.response.status).json(err.response.data)
    })
}
