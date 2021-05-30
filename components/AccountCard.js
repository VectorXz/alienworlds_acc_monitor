import AccountInfo from './AccountInfo';
import { useState, useEffect } from 'react';
import http from './Axios';

export default function AccountCard(props) {
    const { accounts, onDelete, onTotalTLMChange, onTotalWaxChange, onTotalStakedChange } = props

    const initTLM = []
    const initWax = []
    const initStaked = []
    if(accounts.length > initTLM.length) {
        for (let acc of accounts) {
            initTLM.push(0)
            initWax.push(0)
            initStaked.push(0)
        }
    }
    const [TLM, setTLM] = useState(initTLM)
    const [wax, setWax] = useState(initWax)
    const [staked, setStaked] = useState(initStaked)

    const onTLMChange = (i, amt) => {
        if(amt == 'Loading') return
        const newBalance = [...TLM]
        newBalance[i] = amt
        setTLM(newBalance)
    }

    const onAccDelete = (i, acc) => {
        const newTLM = [...TLM]
        const newWAX = [...wax]
        const newStaked = [...staked]
        newTLM.splice(i, 1)
        newWAX.splice(i, 1)
        newStaked.splice(i, 1)
        setTLM(newTLM)
        setWax(newWAX)
        setStaked(newStaked)
        return onDelete(acc)
    }

    useEffect(() => {
        if(TLM.length > 0) {
            const totalBal = TLM.reduce((total, cur) => {
                //console.log(total, cur)
                if(cur == "Loading") {
                    return total
                }
                return total + parseFloat(cur)
            }, 0)
            onTotalTLMChange(totalBal)
        }
    }, [TLM])

    const onWaxChange = (i, amt) => {
        if(amt == 'Loading') return
        const newWax = [...wax]
        newWax[i] = amt
        setWax(newWax)
    }

    useEffect(() => {
        if(wax.length > 0) {
            const totalWax = wax.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalWaxChange(totalWax)
        }
    }, [wax])

    const onStakedChange = (i, amt) => {
        const newStaked = [...staked]
        newStaked[i] = amt
        setStaked(newStaked)
    }

    useEffect(() => {
        if(staked.length > 0) {
            const totalStaked = staked.reduce((total,now) => {
                if(now == 'Loading') {
                    return total
                }
                return total + parseFloat(now)
            }, 0)
            onTotalStakedChange(totalStaked)
        }
    }, [wax])

    return (
        <div className="flex flex-col w-full">
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400">No accounts added yet!</span>}
            {accounts.length > 0 && accounts.map((acc, i) => {
                return (
                    <AccountInfo key={i} index={i} account={acc} axios={http}
                    onDelete={() => onAccDelete(i, acc)}
                    onTLMChange={(amt) => onTLMChange(i, amt)}
                    onWaxChange={(amt) => onWaxChange(i, amt)}
                    onStakedChange={(amt) => onStakedChange(i, amt)} />
                )
            })}
        </div>
    )
}