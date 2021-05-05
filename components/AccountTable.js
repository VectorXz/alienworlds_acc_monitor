import { useState, useEffect } from 'react'

export default function AccountTable(props) {
    const { accounts, onDelete, cpu, balance } = props

    return (
        <div className="flex flex-col w-full">
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400">No accounts added yet!</span>}
            {accounts && accounts.map((acc, i) => {
                const { used, available, max } = cpu[acc] ? cpu[acc] : { used: 0, available: 0, max: 0 }
                const userBalance = balance[acc] ? balance[acc] : "Loading..."
                const percent = max==0 ? "0%" : ((used/max)*100).toFixed(2)+"%"
                return (
                    <div key={i} className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 w-full my-3 items-center">
                        <div className="flex mr-3 items-center justify-center cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="#FF0000"
                            onClick={() => { onDelete(acc) }}>
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className=" text-lg font-bold">{acc}</span>
                        </div>
                        <div className="flex-1 w-full lg:w-9/12 items-center justify-center lg:pr-10">
                            <div className="overflow-hidden h-5 text-xs flex rounded bg-gray-800 w-full">
                                <div style={{ width: percent }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600">
                                    <span className="font-bold">{percent} ( {(used/1000)+" ms"}/{(max/1000)+" ms"} )</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg font-bold text-green-400">{userBalance}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}