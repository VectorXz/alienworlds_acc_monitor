import AccountRow from './AccountRow';
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
        <div className="flex flex-col w-full overflow-auto">
            <table className="table-auto border border-gray-500 border-collapse mt-5">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="w-min">Remove</th>
                        <th>#</th>
                        <th>Miner</th>
                        <th>Wallet</th>
                        <th className="w-4/12">CPU</th>
                        <th>Stake</th>
                        <th>TLM</th>
                        <th>WAX</th>
                        <th>Last mine</th>
                        <th className="w-1/12">Last update</th>
                        <th>NFT</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 && accounts.map((acc, i) => {
                    return (
                            <AccountRow key={i} index={i} account={acc} onDelete={onDelete} onBalChange={(amt) => onBalChange(i, amt)} axios={http} />
                        )
                    })}
                </tbody>
            </table>
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400">No accounts added yet!</span>}
        </div>
    )
}