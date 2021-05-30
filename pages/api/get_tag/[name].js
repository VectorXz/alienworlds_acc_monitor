// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    console.log("/get_tag called")
    const {
        query: { name },
    } = req
    //console.log(name)
    if(!name || typeof name == "undefined" || name == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
    await delay(getRandom(100,2000))
    await axios.post('https://wax.greymass.com/v1/chain/get_table_rows',
    {json: true, code: "federation", scope: "federation", table: 'players', lower_bound: name, upper_bound: name},
    {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 60000
    }
    ).then((response) => {
        return res.status(response.status).json(response.data)
    }).catch(async () => {
        console.log("Start bypass")
        return axios.post('https://hyperion.wax.eosdetroit.io/v1/chain/get_table_row',
        {json: true, code: "federation", scope: "federation", table: 'players', lower_bound: name, upper_bound: name},
        {
            headers: {
                'X-Forwarded-For': mockIp
            },
            timeout: 60000
        }
        ).then((response) => {
            
            return res.status(response.status).json(response.data)
        }).catch((err) => {
            console.log(err.response)
            console.log("Bypass Get Tag Error")
            console.log(err.message)
            return res.status(500).send("API Error")
        })
    })
}
