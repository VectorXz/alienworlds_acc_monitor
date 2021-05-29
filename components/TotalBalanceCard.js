import { useState, useEffect } from 'react'

const TotalBalanceCard = (props) => {
  const { totalTLM, totalWax, totalStaked, TLMPrice, WAXPrice } = props
  
  const [totalUSDT, setTotalUSDT] = useState(0)
  const [options, setOptions] = useState({
    TLM: true,
    WAX: true,
    Staked: false
  })

  useEffect(() => {
    let total = 0
    if(options.TLM) {
      total += totalTLM*TLMPrice.market_price
    }
    if(options.WAX) {
      total += totalWax*WAXPrice.market_price
    }
    if(options.Staked) {
      total += totalStaked*WAXPrice.market_price
    }
    setTotalUSDT(total)
  }, [options, totalTLM, totalWax, totalStaked, TLMPrice, WAXPrice])

  return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 w-full lg:w-5/6">
        <div className="flex flex-col rounded-md items-center justify-center bg-gray-700 w-full h-full py-5">
          <span className="text-xl font-bold">Total TLM</span>
          <span className="text-4xl font-bold text-green-400">{totalTLM.toFixed(4)} TLM</span>
          <span className="text-xs text-blue-300">1 TLM =  {TLMPrice.market_price} USDT @ Binance</span>
          <span className="text-xs text-blue-300">Updated on: {TLMPrice.update}</span>
          <span className="text-md font-bold">~ {(totalTLM*TLMPrice.market_price).toFixed(2)} USDT</span>
        </div>
        <div className="flex flex-col rounded-md items-center justify-center bg-gray-700 w-full h-full py-5">
          <span className="text-xl font-bold">Total WAX</span>
          <span className="text-4xl font-bold text-green-400">{totalWax.toFixed(4)} WAX</span>
          <span className="text-xs text-blue-300">1 WAXP =  {WAXPrice.market_price} USDT @ Huobi</span>
          <span className="text-xs text-blue-300">Updated on: {WAXPrice.update}</span>
          <span className="text-md font-bold">~ {(totalWax*WAXPrice.market_price).toFixed(2)} USDT</span>
        </div>
        <div className="flex flex-col rounded-md items-center justify-center bg-gray-700 w-full h-full py-5">
          <span className="text-xl font-bold">Total WAX Staked</span>
          <span className="text-4xl font-bold text-green-400">{totalStaked.toFixed(4)} WAX</span>
          <span className="text-xs text-blue-300">1 WAXP =  {WAXPrice.market_price} USDT @ Huobi</span>
          <span className="text-xs text-blue-300">Updated on: {WAXPrice.update}</span>
          <span className="text-md font-bold">~ {(totalStaked*WAXPrice.market_price).toFixed(2)} USDT</span>
        </div>
        <div className="flex flex-col rounded-md items-center justify-center bg-gray-700 w-full h-full py-5">
          <span className="text-xl font-bold">Total USDT</span>
          <span className="text-4xl font-bold text-green-400">{totalUSDT.toFixed(2)} USDT</span>
          <div class="flex flex-row gap-x-5">
            <label class="inline-flex items-center mt-3">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.TLM}
                onClick={() => setOptions({...options, TLM: !options.TLM})} />
                <span class="ml-2">TLM</span>
            </label>
            <label class="inline-flex items-center mt-3">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.WAX}
                onClick={() => setOptions({...options, WAX: !options.WAX})} />
                <span class="ml-2">WAX</span>
            </label>
            <label class="inline-flex items-center mt-3">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-gray-600"
                defaultChecked={options.Staked}
                onClick={() => setOptions({...options, Staked: !options.Staked})} />
                <span class="ml-2">WAX Staked</span>
            </label>
          </div>
        </div>
      </div>
  )
}

export default TotalBalanceCard