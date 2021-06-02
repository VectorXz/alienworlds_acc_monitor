// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'

export default async (req, res) => {
    //console.log("/get_tag called")
    let {
        query: { name },
    } = req
    name = name.match(/[a-z0-9.]{4,5}.wam/gm)
    if(!name || typeof name == "undefined" || name == '') return res.status(400)
    name = name[0]
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
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
        return axios.post('https://hyperion.wax.eosdetroit.io/v1/chain/get_table_rows',
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
