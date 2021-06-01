// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    //console.log("/get_last_mine called")
    const {
        query: { name },
    } = req

    if(!name || typeof name == "undefined" || name == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
    await delay(getRandom(100,2000))
    await axios.post('http://wax.eoseoul.io/v1/chain/get_table_rows',
    {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: name, upper_bound: name},
    {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 30000
    }
    ).then((response) => {
        return res.status(200).json(response.data)
    }).catch(async () => {
        return axios.post('https://chain.wax.io/v1/chain/get_table_rows',
        {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: name, upper_bound: name},
        {
            headers: {
                'X-Forwarded-For': mockIp
            },
            timeout: 30000
        }
        ).then((response) => {
            return res.status(200).json(response.data)
        }).catch(async () => {
            
            return axios.post('https://api-wax.eosarabia.net/v1/chain/get_table_rows',
            {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: name, upper_bound: name},
            {
                headers: {
                    'X-Forwarded-For': mockIp
                },
                timeout: 30000
            }
            ).then((response) => {
                
                return res.status(200).json(response.data)
            }).catch((err) => {
                console.log(err.response)
                console.log("Bypass Last Mine Data Error")
                console.log(err.message)
                return res.status(500).send("API Error")
            })
        })
    })
}
