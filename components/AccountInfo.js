import { useState, useEffect, useRef } from 'react'
const { DateTime } = require("luxon");
import delay from 'delay'

export default function AccountInfo(props) {
    const { account, onDelete, onBalChange, index, axios } = props

    const [acc, setAcc] = useState(account)
    const [loading, setLoading] = useState(true)
    const [accInfo, setAccInfo] = useState({})
    const [balance, setBalance] = useState("Loading")
    const [wax, setWax] = useState("Loading")
    const isInitialMount = useRef(true)
    const isInitialTx = useRef(true)
    const [update, setUpdate] = useState("None")
    const [lastMine, setLastMine] = useState({
        last_mine: "Loading",
        last_mine_tx: "Loading",
        currentLand: "Loading"
    })
    const [history, setHistory] = useState([])
    const [minerName, setMinerName] = useState("Loading")

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    const fetchAccountData = async (user) => {
        await delay(getRandom(100, 2000))
        return axios.get(`https://wax.blokcrafters.io/v2/state/get_account?account=${user}`, {
            timeout: 15000
        })
        .then((resp) => {
            if(resp.status == 200) {
                const data = resp.data
                //console.log(data)
                const newCpuState = {
                    ...data.account.cpu_limit,
                    cpu_weight: data.account.total_resources.cpu_weight
                }
                //console.log(newCpuState)
                setAccInfo(newCpuState)
                let lastTokenBalance = [0, 0]
                for (let token of data.tokens) {
                    if(token.symbol === "WAX") {
                        lastTokenBalance[1] = token.amount
                    } else if(token.symbol === "TLM") {
                        lastTokenBalance[0] = token.amount
                    }
                }
                setBalance(lastTokenBalance[0]) //set tlm balance
                setWax(lastTokenBalance[1]) //set wax balance
            }
        })
        .catch(async (err) => {
            console.log(err)
            if(err.response && err.response.status === 500 && err.response.data.message.includes("not found")) return
            return axios.get(`https://wax.cryptolions.io/v2/state/get_account?account=${user}`, {
                timeout: 15000
            })
            .then((resp) => {
                if(resp.status == 200) {
                    const data = resp.data
                    //console.log(data)
                    const newCpuState = {
                        ...data.account.cpu_limit,
                        cpu_weight: data.account.total_resources.cpu_weight
                    }
                    //console.log(newCpuState)
                    setAccInfo(newCpuState)
                    let lastTokenBalance = [0, 0]
                    for (let token of data.tokens) {
                        if(token.symbol === "WAX") {
                            lastTokenBalance[1] = token.amount
                        } else if(token.symbol === "TLM") {
                            lastTokenBalance[0] = token.amount
                        }
                    }
                    setBalance(lastTokenBalance[0]) //set tlm balance
                    setWax(lastTokenBalance[1]) //set wax balance
                }
            }).catch((err) => {
                console.log("Get account error "+user)
                console.log(err.response)
            })
        })
    }

    const getMinerName = async (user) => {
        await delay(getRandom(300,5000))
        const minerName = await axios.post('https://wax.pink.gg/v1/chain/get_table_rows',
        {json: true, code: "federation", scope: "federation", table: 'players', lower_bound: user, upper_bound: user},
        {
            timeout: 15000
        }
        ).then(function({data}) {
            //console.log(data.rows[0]);
            if(data.rows.length < 1) return "Error"
            return data.rows[0].tag
        }).catch((err) => {
            return axios.get(`/api/get_tag/${user}`)
            .then(function({data}) {
                return data.rows[0].tag
            }).catch((err) => {
                return "Error"
            })
        })
        //console.log(minerName)
        if(minerName == "Error") {
            alert(`${user} is not alien worlds account, please check your spelling!`)
            onDelete(acc)
        } else {
            setMinerName(minerName)
        }
    }

    const getLastMineInfo = async (user) => {
        await delay(getRandom(300,5000))
        const lastMineData = await axios.post('https://wax.eosn.io/v1/chain/get_table_rows',
        {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: user, upper_bound: user},
        {
            timeout: 15000
        }
        ).then(function({data}) {
            //console.log(data.rows[0]);
            if(data.rows.length < 1) return {
                last_mine: "None",
                last_mine_tx: "None",
                currentLand: "None"
            }
            return {
                last_mine: data.rows[0].last_mine,
                last_mine_tx: data.rows[0].last_mine_tx,
                currentLand: data.rows[0].current_land
            }
        }).catch((err) => {
            return axios.post('https://wax.eosphere.io/v1/chain/get_table_rows',
            {json: true, code: "m.federation", scope: "m.federation", table: 'miners', lower_bound: user, upper_bound: user},
            {
                timeout: 15000
            }
            )
            .then(({data}) => {
                return {
                    last_mine: data.rows[0].last_mine,
                    last_mine_tx: data.rows[0].last_mine_tx,
                    currentLand: data.rows[0].current_land
                }
            }).catch((err) => {
                return axios.get(`/api/get_last_mine/${user}`)
                .then(({data}) => {
                    return {
                        last_mine: data.rows[0].last_mine,
                        last_mine_tx: data.rows[0].last_mine_tx,
                        currentLand: data.rows[0].current_land
                    }
                })
                .catch((err) => {
                    return {
                        last_mine: "None",
                        last_mine_tx: "None",
                        currentLand: "None"
                    }
                })
            })
        })
        //console.log(lastMineData)
        const lastMineString = lastMineData.last_mine != "None" ? DateTime.fromISO(lastMineData.last_mine+"Z").setZone("local").toRelative() : "Error"
        //console.log("Last mine: "+lastMineString)
        const newLastMine = {
            last_mine: lastMineString,
            last_mine_tx: lastMineData.last_mine_tx,
            currentLand: lastMineData.currentLand
        }
        setLastMine(newLastMine)
    }

    const fetchLastMineTx = async (tx) => {
        await delay(getRandom(300,5000))
        if(tx == "None") { return }
        const lastMineTLM = await axios.get(`https://wax.blokcrafters.io/v2/history/get_transaction?id=${tx}`,{
            timeout: 15000
        }
        ).then(function({data}) {
            return data.actions[1].act.data.amount
        }).catch(async (err) => {
            //console.log("EOSRIO ERR")
            //console.log(err.message)
            await delay(getRandom(300,5000))
            return axios.get(`https://wax.greymass.com/v1/history/get_transaction?id=${tx}`,{
                timeout: 15000
            })
            .then(({data}) => data.traces[1].act.data.quantity.slice(0, -4))
            .catch((err2) => {
                console.log("Fallback Greymass err")
                //console.log(err2.response)
                return axios.get(`https://wax.eosrio.io/v2/history/get_transaction?id=${tx}`,{
                    timeout: 15000
                })
                .then(({data}) => data.actions[1].act.data.amount)
                .catch((err3) => {
                    console.log("3rd Fallback error")
                    //console.log(err3.response)
                    return axios.get(`/api/get_tx/${tx}`)
                    .then(({data}) => data.actions[1].act.data.amount)
                    .catch((err4) => {
                        console.log("Local fallback error")
                        console.log(err4.response)
                        return "ERR"
                    })
                })
            })
        })
        const newHistory = [...history]
        if(newHistory.length == 5) {
            newHistory.shift() //remove first member
        }
        if(history.length === 0 || history.pop().tx !== tx) {
            newHistory.push({
                tx: tx,
                amount: lastMineTLM+" TLM"
            })
            setHistory(newHistory)
        } else {
            //console.log("Duplicate TX")
        }
    }

    useEffect(async () => {
        await getMinerName(acc)
    }, [acc])

    useEffect(async () => {
        //console.log("Loading... "+loading)
        await delay(getRandom(100, 5000))
        setUpdate(DateTime.now().setZone("local").toRFC2822())
        if(loading) {
            //console.log("Checking... "+acc)
            await fetchAccountData(acc)
            await delay(getRandom(100,3000))
            await getLastMineInfo(acc)
            setLoading(false)
        } else {
            //console.log("Not check!")
        }
    }, [loading])

    useEffect(() => {
        //console.log("Balance changed")
        //console.log(balance)
        onBalChange(balance)
    }, [balance])

    useEffect(() => {
        const interval = setInterval(async () => {
            //console.log("It's time to checking!")
            setLoading(true)
        }, 90000);
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