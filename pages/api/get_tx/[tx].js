// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    console.log("/get_tx called")
    const {
        query: { tx },
    } = req

    if(!tx || typeof tx == "undefined" || tx == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    await delay(getRandom(100,2000))
    await axios.get(`https://wax.blokcrafters.io/v2/history/get_transaction?id=${tx}`
    ).then((response) => {
        return res.status(response.status).json(response.data)
    }).catch(async () => {
        return axios.get(`https://wax.cryptolions.io/v2/history/get_transaction?id=${tx}`)
        .then((response) => res.status(response.status).json(response.data))
        .catch(async () => {
            console.log("Start bypass")
            return axios.get(`https://wax.cryptolions.io/v2/history/get_transaction?id=${tx}`,
            {
                headers: {
                    'X-Forwarded-For': mockIp
                },
                timeout: 15000
            })
            .then((response) => {
                console.log("Bypass success!")
                return res.status(response.status).json(response.data)
            })
            .catch((err) => {
                console.log("Error on get transaction data")
                console.log(err)
                return res.status(err2.response.status).json(err.response.data)
            })
        })
    })
}
