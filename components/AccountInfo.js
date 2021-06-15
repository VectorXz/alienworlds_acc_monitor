import { useState, useEffect, useRef } from 'react'
const { DateTime } = require("luxon");
import delay from 'delay'

const v1 = [
    'https://wax.pink.gg',
    'https://wax.cryptolions.io',
    'https://wax.dapplica.io',
    'https://api.wax.liquidstudios.io',
    'https://wax.eosn.io',
    'https://api.wax.alohaeos.com',
    'https://wax.greymass.com',
    'https://wax-bp.wizardsguild.one',
    'https://apiwax.3dkrender.com',
    'https://wax.eu.eosamsterdam.net',
    'https://wax.csx.io',
    'https://wax.eoseoul.io',
    'https://wax.eosphere.io',
    'https://api.waxeastern.cn'
]

const tx_api = [
    'https://wax.greymass.com',
    'https://wax.cryptolions.io',
    'https://api.wax.alohaeos.com',
    'https://wax.blacklusion.io',
    'https://waxapi.ledgerwise.io',
]

const tx_api_v2 = [
    'https://api.wax.alohaeos.com',
    'https://wax.eu.eosamsterdam.net',
    'https://api.waxsweden.org',
    'https://wax.cryptolions.io'
]

export default function AccountInfo(props) {
    const { index, account, axios, onDelete, onTLMChange, onWaxChange, onStakedChange } = props

    const [acc, setAcc] = useState(account)
    const [loading, setLoading] = useState(true)
    const [accInfo, setAccInfo] = useState({})
    const [balance, setBalance] = useState("Loading")
    const [wax, setWax] = useState("Loading")
    const isInitialTx = useRef(true)
    const [update, setUpdate] = useState("None")
    const [lastMine, setLastMine] = useState({
        last_mine: "Loading",
        last_mine_tx: "Loading",
        currentLand: "Loading"
    })
    const [history, setHistory] = useState([])
    const [minerName, setMinerName] = useState("Loading")
    const [nft, setNft] = useState([])

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const fetchTLM = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_currency_balance`,
            {
                "code": "alien.worlds",
                "account": user,
                "symbol": "TLM"
            })
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tlm/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result && result.length > 0) {
            //console.log(result)
            setBalance(result[0].slice(0, -4))
        }
    }

    const fetchAccountData = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_account`,
            {
                "account_name": user
            })
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_account/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result) {
            console.log("Setting data")
            console.log(result)
            const newCpuState = {
                ...result.cpu_limit,
                cpu_weight: result.total_resources.cpu_weight
            }
            setAccInfo(newCpuState)
            console.log(result.core_liquid_balance)
            if(result.core_liquid_balance) {
                setWax(result.core_liquid_balance.slice(0, -4))
            } else {
                setWax("N/A")
            }
        }
    }

    const getMinerName = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "federation", scope: "federation", table: 'players', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tag/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result.rows.length < 1) {
            alert(`${user} is not alien worlds account, please check your spelling!`)
            onDelete(acc)
            return
        }
        if(result) {
            console.log("Setting Tag data")
            console.log(result)
            setMinerName(result.rows[0].tag)
        }
    }

    const getLastMineInfo = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_lastmine/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result.rows.length < 1) {
            return
        }
        if(result) {
            console.log("Setting Lastmine data")
            console.log(result)
            const lastMineString = result.rows[0].last_mine != "None" ? DateTime.fromISO(result.rows[0].last_mine+"Z").setZone("local").toRelative() : "Error"
            const newLastMine = {
                last_mine: lastMineString,
                last_mine_tx: result.rows[0].last_mine_tx,
                currentLand: result.rows[0].current_land
            }
            setLastMine(newLastMine)
        }
    }
    
    const fetchLastMineTx = async (tx) => {
        let api_index = getRandom(0, tx_api.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${tx_api[api_index%tx_api.length]}/v1/history/get_transaction`,
            {
                id: tx
            })
            .then((resp) => {
                if(resp && resp.data) {
                    //console.log(resp.data)
                    if(tx_api[api_index%tx_api.length]=='https://wax.greymass.com/v1/history/get_transaction') {
                        result = {
                            mined: parseFloat(resp.data.traces[1].act.data.quantity.slice(0, -4))
                        }
                    } else {
                        result = { mined: resp.data.traces[1].act.data.amount }
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            // Try v2
            tries = 0
            api_index = getRandom(0, tx_api_v2.length)
            while(tries < 3) {
                console.log("TRY ",tries)
                await axios.get(`${tx_api_v2[api_index%tx_api_v2.length]}/v2/history/get_transaction?id=${tx}`)
                .then((resp) => {
                    if(resp && resp.data) {
                        result = { mined: resp.data.actions[1].act.data.amount }
                    }
                })
                .catch((err) => {
                    console.log(err)
                    tries++
                    api_index++
                })
                if(result != null) {
                    break;
                }
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/get_tx/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result && result.mined) {
            console.log("Setting TX data")
            console.log(result)
            const newHistory = [...history]
            if(newHistory.length == 5) {
                newHistory.shift() //remove first member
            }
            if(history.length === 0 || history.pop().tx !== tx) {
                newHistory.push({
                    tx: tx,
                    amount: result.mined+" TLM"
                })
                setHistory(newHistory)
            }
        }
    }

    const checkNFT = async (user) => {
        let api_index = getRandom(0, v1.length)
        let tries = 0
        let result = null
        while(tries < 3) {
            console.log("TRY ",tries)
            await axios.post(`${v1[api_index%v1.length]}/v1/chain/get_table_rows`,
            {json: true, code: "m.federation", scope: "m.federation", table: 'claims', lower_bound: user, upper_bound: user})
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                console.log(err)
                tries++
                api_index++
            })
            if(result != null) {
                break;
            }
        }
        if(!result) {
            await axios.get(`https://api.alienworlds.fun/check_nft/${user}`)
            .then((resp) => {
                if(resp && resp.data) {
                    result = resp.data
                }
            })
            .catch((err) => {
                if(err.response) {
                    console.log(err.response)
                } else {
                    console.log(err.message)
                }
            })
        }
        if(result.rows.length < 1) {
            setNft([])
            return
        }
        if(result) {
            console.log("Setting NFT data")
            console.log(result)
            setNft([...result.rows[0].template_ids])
        }
    }

    useEffect(async () => {
        await getMinerName(acc)
        await checkNFT(acc)
    }, [acc])

    useEffect(async () => {
        //console.log("Loading... "+loading)
        await delay(getRandom(100, 5000))
        setUpdate(DateTime.now().setZone("local").toRFC2822())
        if(loading) {
            //console.log("Checking... "+acc)
            await fetchAccountData(acc)
            await fetchTLM(acc)
            await delay(getRandom(100,1500))
            await getLastMineInfo(acc)
            await checkNFT(acc)
            setLoading(false)
        } else {
            //console.log("Not check!")
        }
    }, [loading])

    useEffect(() => {
        onTLMChange(balance)
    }, [balance])

    useEffect(() => {
        onWaxChange(wax)
    }, [wax])

    useEffect(() => {
        if(accInfo.cpu_weight) {
            onStakedChange(accInfo.cpu_weight.slice(0, -4))
        }
    }, [accInfo.cpu_weight])

    useEffect(() => {
        const interval = setInterval(async () => {
            //console.log("It's time to checking!")
            setLoading(true)
        }, 120000);
        return () => clearInterval(interval);
    }, []);

    useEffect(async () => {
        if(isInitialTx.current) {
            isInitialTx.current = false
        } else {
            //console.log("Last mine TX Changed!")
            if(lastMine.last_mine_tx == "Loading" || lastMine.last_mine_tx == "None") return
            await fetchLastMineTx(lastMine.last_mine_tx)
        }
    }, [lastMine.last_mine_tx])

    const rawPercent = ((accInfo.used/accInfo.max)*100).toFixed(2)
    const percent = accInfo.used ? rawPercent > 100 ? 100 : rawPercent : 0
    const barColor = percent >= 80 ? "bg-red-600" : percent >= 50 ? "bg-yellow-600" : "bg-blue-600"

    return (
        <div className="flex flex-col my-5">
            <span className="font-bold">[{index+1}] Miner: {minerName}</span>
            <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 w-full items-center">
                <div className="flex mr-3 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 cursor-pointer" viewBox="0 0 20 20" fill="#FF0000"
                    onClick={() => { onDelete(acc) }}>
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className=" text-lg font-bold">{acc}</span>
                </div>
                <div className="flex-1 w-full lg:w-9/12">
                    <div className="overflow-hidden h-5 text-xs flex rounded bg-gray-800 w-full">
                        <div style={{ width: percent+"%" }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor}`}>
                            {accInfo.used && <span className="font-bold">{rawPercent}% ({accInfo.used/1000} ms/{accInfo.max/1000} ms)</span>}
                            {!accInfo.used && <span className="font-bold">Loading...</span>}
                        </div>
                    </div>
                </div>
                <div className="flex px-3">
                    <span className="font-bold text-sm text-yellow-300">CPU Staked: {accInfo.cpu_weight}</span>
                </div>
                <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg font-bold text-green-400">{balance} TLM | {wax} WAX</span>
                    <a href={'https://wax.atomichub.io/explorer/account/'+acc} className="mx-2 px-2 font-bold text-green-600 bg-green-200 rounded-md" rel="noopener noreferrer" target="_blank">View NFT</a>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full mt-1 justify-between">
                <div className="flex flex-col  gap-y-1 lg:gap-y-0.5 mt-1">
                    <span className="text-xs font-bold text-red-500">Current land: <a href={'https://wax.atomichub.io/explorer/asset/'+lastMine.currentLand}>{lastMine.currentLand}</a></span>
                    <span className="text-xs">Last update: {update}</span>
                    <span className="text-xs">Next update: {DateTime.fromRFC2822(update).plus({ minutes: 1, seconds: 30}).toRFC2822()}</span>
                </div>
                <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-y-2 mt-2 lg:mt-0 lg:gap-y-0.5">
                    {nft && nft.length > 0 && <span className="font-bold text-xs">{nft.length} NFTs Claimable!</span>}
                    <span className="text-sm font-bold self-end">Last TLM mined ({lastMine.last_mine}):</span>
                    <span className="text-xs my-2 self-end">{history.map((hist, i) => {
                        return (
                            <a key={i} href={hist.tx!="None" ? `https://wax.bloks.io/transaction/`+hist.tx : `#`} rel="noopener noreferrer" target="_blank">
                                <span
                                className={'inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-black rounded-full bg-green-'+(600-((history.length-i)*100))}>
                                {hist.amount}
                                </span>
                            </a>
                        )
                    })}
                    </span>
                </div>
            </div>
        </div>
    )
}