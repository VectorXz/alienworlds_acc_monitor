import Head from 'next/head'
import AccountCards from '../components/AccountCards'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { DateTime } from 'luxon'
import btoa from 'btoa'
import atob from 'atob'
import Link from 'next/link'

export default function Home(props) {

  const cookies = new Cookies();

  const cookieOptions = {
    secure: true,
    expires: DateTime.now().plus({ months: 6}).toJSDate()
  }

  if(props.urlAcc && !cookies.get("accounts")) {
    cookies.set("accounts", props.urlAcc, cookieOptions)
  }

  const defaultAcc = props.urlAcc ? props.urlAcc : cookies.get("accounts") ? cookies.get("accounts") : []
  const [account, setAccount] = useState(defaultAcc)
  const [input, setInput] = useState("")
  const genLink = props.urlAcc ? 'https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(props.urlAcc)) : cookies.get("accounts") ? 'https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(cookies.get("accounts"))) : "Please add some accounts first!"
  const [link, setLink] = useState(genLink)
  const [copied, setCopied] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalUSD, setTotalUSD] = useState({
    market_price: 0,
    totalUSD: 0,
    update: "None"
  })

  const handleAddAcc = (e) => {
    e.preventDefault()
    const account_arr = Array.from(new Set(input.split(" ")))
    console.log(account_arr)
    let newAcc = [...account]
    for(let acc of account_arr) {
      acc = acc.replace(/\s/g, "")
      console.log(acc)
      if([...account].includes(acc) || account_arr.reduce((count, cur) => cur===acc ? count+=1 : count) > 1) {
        alert(`Account: ${acc} exists!`)
      }
      newAcc.push(acc)
    }
    setAccount(newAcc)
    setInput("")
  }

  const fetchTLMPrice = async () => {
    const lastPrice = await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=TLMUSDT')
    .then(({data}) => {
      //console.log(data.price)
      return data.price
    })
    .catch((err) => {
      console.log("ERROR: cannot get market price")
      console.log(err)
      return 0
    })
    return lastPrice
  }

  useEffect(() => {
    console.log("Account Changed!")
    console.log(account)
    cookies.set("accounts", account, cookieOptions)
    setLink('https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(account)))
  }, [account])

  useEffect(async () => {
    //console.log("total "+total)
    let lastPrice = 0
    const now = DateTime.now().setZone("local")
    const nextUpdate = totalUSD.update != "None" ? DateTime.fromRFC2822(totalUSD.update).plus({ seconds: 30}) : now
    // console.log(now.toHTTP())
    // console.log(nextUpdate.toHTTP())
    if (nextUpdate <= now) {
      lastPrice = await fetchTLMPrice()
      const newTotalUSD = {
        market_price: lastPrice,
        totalUSD: total * lastPrice,
        update: DateTime.now().setZone("local").toRFC2822()
      }
      setTotalUSD(newTotalUSD)
      //console.log("Price updated at "+DateTime.now().setZone("local").toRFC2822())
    } else {
      const newTotalUSD = {
        ...totalUSD,
        totalUSD: total * totalUSD.market_price
      }
      setTotalUSD(newTotalUSD)
      //console.log("Total updated at "+DateTime.now().setZone("local").toRFC2822())
    }
  }, [total])

  const handleDeleteAcc = (acc) => {
    let newAcc = [...account].filter((arr) => arr != acc)
    setAccount(newAcc)
  }

  const handleDeleteCookies = () => {
    cookies.remove("accounts")
    setAccount([])
    setInput("")
    setTotal(0)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center mt-10 px-2 lg:px-0">
      <Head>
        <title>Alienworlds Wax Account Monitor</title>
        <meta name="description" content="Alienworlds Wax Account Monitor" />
      </Head>

      <main className="flex flex-col w-full lg:w-3/6">
        <div className="flex flex-col">
          <span className="text-5xl font-bold mb-3 text-center">AW Wax Account Monitor <span className="text-sm text-blue-400">v1.3</span></span>
          <div className="mx-2 px-2 font-bold text-green-600 bg-green-200 rounded-md text-center w-auto self-center">
            <span className="text-center text-sm">Like this website? You can donate us by sending WAX to 1crtk.wam</span>
          </div>
          <span className="text-center text-sm mt-2">This website is open source on <a className="text-blue-400" href="https://github.com/VectorXz/alienworlds_acc_monitor">GitHub</a></span>
        </div>

        <div className="flex flex-col lg:flex-row w-full items-center justify-center rounded-md shadow-lg p-6 mt-10 mb-2 bg-gray-700 gap-x-4 gap-y-5 lg:gap-y-0">
          <div className="flex-1 flex-col">
            <form className="w-full" onSubmit={handleAddAcc}>
              <div className="flex flex-row items-center justify-center w-full">
                <label className="text-center lg:mr-4">WAM Account:</label>
                <input type="text" className="shadow appearance-none w-4/6 rounded py-2 px-3 bg-gray-300 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => { setInput(e.target.value) }} value={input} />
              </div>
              <div className="text-xs font-bold mt-0.5 text-red-300 text-center">Adding multiple accounts at once is supported by using space <br /> Ex. abcde.wam efghj.wam 1a2b3.wam</div>
              <div className="mt-5 w-full">
                <button className="bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit">
                  ADD
                </button>
              </div>
            </form>
            <button className="mt-2 bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="button" onClick={handleDeleteCookies}>
              DELETE ALL DATAS (COOKIES)
            </button>
          </div>
          <div className="flex-1 flex-col">
            {account.length > 0 && 
              <div className="flex-1 flex-col">
                <div className="text-center mb-1"><span className="text-xl font-bold mb-1">Save this link to view these accounts later</span></div>
                <div><input type="text" className="shadow appearance-none w-4/6 rounded w-full py-2 px-3 bg-gray-300 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                value={link} onClick={(e) => {e.target.select();navigator.clipboard.writeText(link);setCopied(true)}} onFocus={(e) => {e.target.select();}} readOnly /></div>
                {copied && <div><span className="font-bold text-sm mt-3">Copied to clipboard!</span></div>}
              </div>
            }
            <div className="flex flex-col items-center mt-3">
              <span className="text-3xl font-bold text-green-400 text-center">Total TLM: {total.toFixed(4)}</span>
              <span className="text-md font-bold text-blue-400 text-center">Binance TLM Price(avg. 5min): {totalUSD.market_price} USDT</span>
              <span className="text-xs font-bold text-blue-400 text-center">Last update price: {totalUSD.update}</span>
              <span className="text-3xl font-bold text-green-400 text-center">Total USDT: {totalUSD.totalUSD.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6">
        <div className="text-center py-4 lg:px-4">
          <div className="p-2 px-4 bg-blue-800 items-center text-blue-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
            <span className="flex rounded-full bg-blue-500 uppercase px-2 py-1 text-xs font-bold mr-3">New 27/5/2021</span>
            <span className="font-semibold mr-2 text-left flex-auto">Table Layout is now live! Try switch to "Table" below.</span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <span className="text-xl font-bold mr-3">Select Layout: </span>
          <ul className="flex">
            <li className="mr-3">
              <Link href="/cards"><a className="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white font-bold">Cards</a></Link>
            </li>
            <li className="mr-3">
            <Link href="/table"><a className="inline-block border border-blue-500 rounded hover:border-blue-200 text-blue-500 hover:bg-blue-200 py-1 px-3 font-bold">Table</a></Link>
            </li>
          </ul>
        </div>
        <div className="flex mt-2">
            <span className="text-red-500 font-bold">*Please wait for information to be loaded before changing layout*</span>
        </div>
      </div>

      <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">
        <span className="text-lg font-bold text-center my-1 text-indigo-300">Data will automatically refresh every 90 secs</span>
        <span className="text-lg font-bold text-center my-1 text-indigo-300">Click at trash icon to delete account</span>
        <AccountCards accounts={account} onDelete={handleDeleteAcc} onTotalChange={(newTotal) => { setTotal(newTotal) }} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  //console.log(context.query)
  if('accounts' in context.query) {
    const acc = JSON.parse(atob(context.query.accounts))
    //console.log(acc)
    return {
      props: {
        urlAcc: acc
      }
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}