// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    //console.log("/get_account called")
    let {
        query: { name },
    } = req
    name = name.match(/[a-z0-9.]{4,5}.wam/gm)
    if(!name || typeof name == "undefined" || name == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
    await delay(getRandom(100,2000))
    await axios.get(`https://api-wax.eosarabia.net/v2/state/get_account?account=${name}`, {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 30000
    })
    .then((resp) => {
        if(resp.status == 200) {
            return res.status(resp.status).json(resp.data)
        }
    })
    .catch(async (err) => {
        if(err.response && err.response.status === 500 && err.response.data && err.response.data.message.includes("not found")) return
        return axios.get(`https://wax.cryptolions.io/v2/state/get_account?account=${name}`, {
            headers: {
                'X-Forwarded-For': mockIp
            },
            timeout: 30000
        })
        .then((resp) => {
            if(resp.status == 200) {
                return res.status(resp.status).json(resp.data)
            }
        }).catch(async () => {
            return axios.get(`https://wax.eosrio.io/v2/state/get_account?account=${name}`, {
                headers: {
                    'X-Forwarded-For': mockIp
                },
                timeout: 30000
            })
            .then((resp) => {
                if(resp.status == 200) {
                    
                    return res.status(resp.status).json(resp.data)
                }
            }).catch(async () => {
                return axios.get(`https://wax.eosphere.io/v2/state/get_account?account=${name}`, {
                    headers: {
                        'X-Forwarded-For': mockIp
                    },
                    timeout: 30000
                })
                .then((resp) => {
                    if(resp.status == 200) {
                        return res.status(resp.status).json(resp.data)
                    }
                }).catch((err2) => {
                    console.log(err2.response)
                    console.log("Bypass Get Account Error")
                    console.log(err2.message)
                    return res.status(500).send("API Error")
                })
            })
        })
    })
}
