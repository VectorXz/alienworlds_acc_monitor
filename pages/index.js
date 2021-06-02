import Head from 'next/head'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { DateTime } from 'luxon'
import btoa from 'btoa'
import atob from 'atob'
import AccountCard from '../components/AccountCard'
import AccountTable from '../components/AccountTable'
import TotalBalanceCard from '../components/TotalBalanceCard'

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
  const [totalTLM, setTotalTLM] = useState(0)
  const [totalWax, setTotalWax] = useState(0)
  const [totalStaked, setTotalStaked] = useState(0)
  const [TLMPrice, setTLMPrice] = useState({
    market_price: 0,
    update: "None"
  })
  const [WAXPrice, setWAXPrice] = useState({
    market_price: 0,
    update: "None"
  })
  const [layout, setLayout] = useState("")

  const handleAddAcc = (e) => {
    e.preventDefault()
    const account_arr = Array.from(new Set(input.split(" ")))
    //console.log(account_arr)
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
    return axios.get('https://api.binance.com/api/v3/avgPrice?symbol=TLMUSDT')
    .then(({data}) => {
      return data.price
    })
    .catch((err) => {
      console.log("ERROR: cannot get TLM market price")
      console.log(err)
      return 0
    })
  }

  const fetchWAXPrice = async () => {
    return axios.get('https://api.huobi.pro/market/detail?symbol=waxpusdt')
    .then(({data}) => {
      return data.tick.close
    })
    .catch((err) => {
      console.log("ERROR: cannot get WAX market price")
      console.log(err)
      return 0
    })
  }

  const handleDeleteAcc = (acc) => {
    //console.log("Delete account ",acc)
    let newAcc = [...account].filter((arr) => arr != acc)
    setAccount(newAcc)
  }

  const handleDeleteCookies = () => {
    cookies.remove("accounts")
    setAccount([])
    setInput("")
    setTotalTLM(0)
  }

  useEffect(() => {
    //console.log("Account Changed!")
    //console.log(account)
    cookies.set("accounts", account, cookieOptions)
    setLink('https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(account)))
  }, [account])

  useEffect(async () => {
    let lastTLMPrice = 0
    let lastWaxPrice = 0
    const now = DateTime.now().setZone("local")
    const nextUpdate = TLMPrice.update != "None" ? DateTime.fromRFC2822(TLMPrice.update).plus({ seconds: 30}) : now
    if (nextUpdate <= now) {
      lastTLMPrice = await fetchTLMPrice()
      const newTLMPrice = {
        market_price: lastTLMPrice,
        update: DateTime.now().setZone("local").toRFC2822()
      }
      setTLMPrice(newTLMPrice)
      lastWaxPrice = await fetchWAXPrice()
      const newWaxPrice = {
        market_price: lastWaxPrice,
        update: DateTime.now().setZone("local").toRFC2822()
      }
      setWAXPrice(newWaxPrice)
    }
  }, [totalTLM, totalWax, totalStaked])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center mt-10 px-2 lg:px-0">
      <Head>
        <title>Alienworlds Account Monitor | The only AW monitor website you needed | Monitor CPU,WAX,TLM,NFT, etc. of alienworlds here!</title>
        <meta name="description" content="Alienworlds.fun the only alienworlds monitor website that you needed. Included CPU,WAX,TLM,NFT,etc. No login needed. Start monitoring your alienworlds team now!" />
      </Head>

      <main className="flex flex-col w-full lg:w-3/6">
        <div className="flex flex-col">
          <span className="text-5xl font-bold mb-3 text-center">Alienworlds Account Monitor <span className="text-md text-blue-400">v2.4</span></span>
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
          <div className="flex-1 flex-col w-full">
            <div className="flex w-full items-center justify-center">
              <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAlienworldsfun-100734315569585&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width={340}
              height={130}
              style={{border: 'none', overflow: 'hidden'}}
              scrolling="no"
              frameBorder={0}
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
            {account.length > 0 && 
              <div className="flex-1 flex-row text-center mt-2">
                <div className="text-center mb-1"><span className="text-xl font-bold mb-1">Save this link to view these accounts later</span></div>
                <div><input type="text" className="shadow appearance-none w-4/6 rounded w-full py-2 px-3 bg-gray-300 mt-1 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                value={link} onClick={(e) => {e.target.select();navigator.clipboard.writeText(link);setCopied(true)}} onFocus={(e) => {e.target.select();}} readOnly /></div>
                {copied && <div><span className="font-bold text-sm mt-3">Copied to clipboard!</span></div>}
              </div>
            }
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
              <a className={`cursor-pointer inline-block border border-blue-500 rounded hover:border-blue-20
hover:bg-blue-200 py-1 px-3 font-bold ${layout==='Cards' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
              onClick={() => setLayout("Cards")}>Cards</a>
            </li>
            <li className="mr-3">
              <a className={`cursor-pointer inline-block border border-blue-500 rounded hover:border-blue-20
hover:bg-blue-200 py-1 px-3 font-bold ${layout==='Table' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
              onClick={() => setLayout("Table")}>Table</a>
            </li>
          </ul>
        </div>
        <div className="flex mt-2 text-center">
            <span className="text-red-500 font-bold">*Please wait for information to be loaded before changing layout*</span>
        </div>
      </div>

      {layout != 'Cards' && layout != 'Table' && <>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Loaded {account.length} accounts</h1>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-5 mt-3">
            {account.map((acc) => {
              return (
                <div className="p-3 px-5 text-center bg-gray-600 rounded-md">
                  <h1>{acc}</h1>
                </div>
              )
            })}
          </div>
        </div>
      </>}
      {layout === 'Cards' && <>
        <TotalBalanceCard totalTLM={totalTLM} totalWax={totalWax} totalStaked={totalStaked}
        TLMPrice={TLMPrice} WAXPrice={WAXPrice} />
        <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">
          <span className="text-lg font-bold text-center my-1 text-indigo-300">Data will automatically refresh every 90 secs</span>
          <span className="text-lg font-bold text-center my-1 text-indigo-300">Click at trash icon to delete account</span>
          <AccountCard accounts={account}
          onDelete={handleDeleteAcc}
          onTotalTLMChange={(newTotal) => { setTotalTLM(newTotal) }}
          onTotalWaxChange={(newTotal) => { setTotalWax(newTotal) }}
          onTotalStakedChange={(newTotal) => { setTotalStaked(newTotal) }}
          />
        </div>
      </>}
      {layout === 'Table' && <>
        <TotalBalanceCard totalTLM={totalTLM} totalWax={totalWax} totalStaked={totalStaked}
          TLMPrice={TLMPrice} WAXPrice={WAXPrice} />
        <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">
          <span className="text-lg font-bold text-center my-1 text-indigo-300">Data will automatically refresh every 90 secs</span>
          <span className="text-lg font-bold text-center my-1 text-indigo-300">Click at trash icon to delete account</span>
          <span className="visible xl:invisible">If you're using mobile, you may need to scroll along the table.</span>
          <AccountTable accounts={account}
          onDelete={handleDeleteAcc}
          onTotalTLMChange={(newTotal) => { setTotalTLM(newTotal) }}
          onTotalWaxChange={(newTotal) => { setTotalWax(newTotal) }}
          onTotalStakedChange={(newTotal) => { setTotalStaked(newTotal) }}
          />
        </div>
      </>}
    </div>
  )
}

export async function getServerSideProps(context) {
  //console.log(context.query)
  if('accounts' in context.query) {
    let acc = []
    try {
      acc = JSON.parse(atob(context.query.accounts))
    } catch (e) {
      console.log("Parse account error")
      return {
        props: {}
      }
    }
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