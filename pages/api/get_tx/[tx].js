// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from '../AxiosAPI'
import delay from 'delay'

export default async (req, res) => {
    //console.log("/get_tx called")
    const {
        query: { tx },
    } = req

    if(!tx || typeof tx == "undefined" || tx == '') return res.status(400)
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    const mockIp = `${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}.${getRandom(1,255)}`
    await delay(getRandom(100,2000))
    await axios.get(`https://apiwax.3dkrender.com/v2/history/get_transaction?id=${tx}`,
    {
        headers: {
            'X-Forwarded-For': mockIp
        },
        timeout: 60000
    }
    ).then((response) => {
        return res.status(response.status).json(response.data)
    }).catch(async () => {
        return axios.get(`https://api-wax.eosarabia.net/v2/history/get_transaction?id=${tx}`,
        {
            headers: {
                'X-Forwarded-For': mockIp
            },
            timeout: 60000
        })
        .then((response) => res.status(response.status).json(response.data))
        .catch(async () => {
            return axios.get(`https://api.wax.alohaeos.com/v2/history/get_transaction?id=${tx}`,
            {
                headers: {
                    'X-Forwarded-For': mockIp
                },
                timeout: 60000
            })
            .then((response) => {
                
                return res.status(response.status).json(response.data)
            })
            .catch((err) => {
                console.log(err.response)
                console.log("Bypass Get TX Error")
                console.log(err.message)
                return res.status(500).send("API Error")
            })
        })
    })
}
