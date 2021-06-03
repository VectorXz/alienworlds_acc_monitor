import { useState, useEffect, useRef } from 'react'
const { DateTime } = require("luxon");
import delay from 'delay'

export default function AccountRow(props) {
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
    const [expanded, setExpanded] = useState(false)
    const [nft, setNft] = useState(false)

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const fetchAccountData = async (user) => {
        await axios.get(`https://api.alienworlds.fun/get_account/${user}`)
        .then((resp) => {
            if(resp && resp.data) {
                const newCpuState = {
                    ...resp.data.cpu_limit,
                    cpu_weight: resp.data.total_resources.cpu_weight
                }
                setAccInfo(newCpuState)
                setWax(resp.data.core_liquid_balance.slice(0, -4))
            }
        })
        .catch((err) => {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log(err.message)
            }
        })
        await axios.get(`https://api.alienworlds.fun/get_tlm/${user}`)
        .then((resp) => {
            if(resp && resp.data) {
                setBalance(resp.data[0].slice(0, -4))
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

    const getMinerName = async (user) => {
        await delay(getRandom(100,1500))
        const tagName = await axios.get(`https://api.alienworlds.fun/get_tag/${user}`)
        .then(function({status, data}) {
            if(status == 200) {
                if(data.rows.length < 1) return "NOT_FOUND"
                return data.rows[0].tag
            } else {
                throw new Error(`API Error ${status}`)
            }
        }).catch((err) => {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log(err.message)
            }
            return "Error"
        })
        //console.log(minerName)
        if(tagName == "NOT_FOUND") {
            alert(`${user} is not alien worlds account, please check your spelling!`)
            onDelete(acc)
        } else {
            setMinerName(tagName)
        }
    }

    const getLastMineInfo = async (user) => {
        await delay(getRandom(100,1500))
        const lastMineData = await axios.get(`https://api.alienworlds.fun/get_lastmine/${user}`)
        .then(function({data}) {
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
            if(err.response) {
                console.log(err.response)
            } else {
                console.log(err.message)
            }
            return {
                last_mine: "None",
                last_mine_tx: "None",
                currentLand: "None"
            }
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
        await delay(getRandom(100,1500))
        if(tx == "None") { return }
        const lastMineTLM = await axios.get(`https://api.alienworlds.fun/get_tx/${tx}`)
        .then(function({data}) {
            return data.mined
        }).catch((err) => {
            if(err.response) {
                console.log(err.response)
            } else {
                console.log(err.message)
            }
            return "Error"
        })
        if(lastMineTLM == 'Error') return
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
        }
    }

    const checkNFT = async (user) => {
        await delay(getRandom(100,1500))
        await axios.get(`https://api.alienworlds.fun/check_nft/${user}`)
        .then(function({status, data}) {
            if(status == 200) {
                if(data.rows.length > 0) {
                    return setNft([...data.rows[0].template_ids])
                }
            } else {
                throw new Error(`API Error ${status}`)
            }
        }).catch((err) => {
            console.log("Cannot check NFT")
            if(err.response) {
                console.log(err.response)
            } else {
                console.log(err.message)
            }
        })
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
    const bgRow = index%2!=0 ? "bg-gray-600" : ""
    const lastMineBg = lastMine.last_mine.includes('month') || lastMine.last_mine.includes('day') ? 
    'bg-red-700' : 
    lastMine.last_mine.includes('hour') ? 'bg-yellow-600' : 'bg-blue-600'

    return (
        <>
            <tr className={"text-center "+bgRow}>
                <td className="p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer mx-auto" viewBox="0 0 20 20" fill="#FF0000"
                    onClick={() => { onDelete(acc) }}>
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </td>
                <td className="font-bold">{index+1}</td>
                <td>{minerName}</td>
                <td>{acc}</td>
                <td>
                    <div className="overflow-hidden h-5 text-xs flex rounded bg-gray-800 w-full">
                        <div style={{ width: percent+"%" }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor}`}>
                            {accInfo.used && <span className="font-bold">{rawPercent}% ({accInfo.used/1000} ms/{accInfo.max/1000} ms)</span>}
                            {!accInfo.used && <span className="font-bold">Loading...</span>}
                        </div>
                    </div>
                </td>
                <td>{accInfo.cpu_weight}</td>
                <td>{balance} TLM</td>
                <td>{wax} WAX</td>
                <td><span className={`text-sm font-bold px-2 rounded-md whitespace-nowrap `+lastMineBg}>{lastMine.last_mine}</span>
                <br/>{history[0] ? 
                <span
                className={'inline-flex items-center justify-center font-bold text-xs'}>
                {history[0].amount}
                </span> : ''}</td>
                <td className="text-xs">{update}</td>
                <td>
                <a 
                className="inline-flex items-center h-8 px-4 m-2 text-sm text-white font-bold transition-colors 
                duration-150 bg-green-600 rounded-lg focus:shadow-outline hover:bg-green-800" 
                href={'https://wax.atomichub.io/explorer/account/'+acc}
                rel="noopener noreferrer" target="_blank">NFT</a>
                <br />
                {nft && nft.length > 0 && <span className="font-bold text-xs">{nft.length} NFTs Claimable!</span>}
                </td>
            </tr>
            {/* {expanded && <>
                <tr>
                    <td>Hello</td>
                </tr>
            </>} */}
        </>
    )
}