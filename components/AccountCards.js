import AccountInfo from './AccountInfo';
import { useState, useEffect } from 'react';
import http from './Axios';

export default function AccountTable(props) {
    const { accounts, onDelete, onTotalChange } = props

    const initBalance = []
    for (let acc of accounts) {
        initBalance.push(0)
    }

    const [balance, setBalance] = useState(initBalance)

    const onBalChange = (i, amt) => {
        const newBalance = [...balance]
        newBalance[i] = amt
        setBalance(newBalance)
    }

    useEffect(() => {
        //console.log("Balance updated!")
        //console.log(balance)
        if(balance.length > 0) {
            const totalBal = balance.reduce((total, cur) => {
                //console.log(total, cur)
                if(cur == "Loading") {
                    return total
                }
                return total += parseFloat(cur)
            }, 0)
            onTotalChange(totalBal)
        }
    }, [balance])

    return (
        <div className="flex flex-col w-full">
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400">No accounts added yet!</span>}
            {accounts.length > 0 && accounts.map((acc, i) => {
                return (
                    <AccountInfo key={i} index={i} account={acc} onDelete={onDelete} onBalChange={(amt) => onBalChange(i, amt)} axios={http} />
                )
            })}
        </div>
    )
}