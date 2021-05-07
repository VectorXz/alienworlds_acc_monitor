import Head from 'next/head'
import AccountTable from '../components/AccountTable'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { DateTime } from 'luxon'
import btoa from 'btoa'
import atob from 'atob'

export default function Home(props) {

  const cookies = new Cookies();

  const cookieOptions = {
    secure: true,
    expires: DateTime.now().plus({ months: 6}).toJSDate()
  }

  const defaultAcc = props.urlAcc ? props.urlAcc : cookies.get("accounts") ? cookies.get("accounts") : []
  const [account, setAccount] = useState(defaultAcc)
  const [input, setInput] = useState("")
  const genLink = props.urlAcc ? 'https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(props.urlAcc)) : cookies.get("accounts") ? 'https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(cookies.get("accounts"))) : "Please add some accounts first!"
  const [link, setLink] = useState(genLink)
  const [copied, setCopied] = useState(false)

  const handleAddAcc = (e) => {
    e.preventDefault()
    if([...account].includes(input.trim())) {
      alert("Account exists!")
      return
    }
    let newAcc = [...account]
    newAcc.push(input.replace(/\s/g, ""))
    setAccount(newAcc)
    setInput("")
  }

  useEffect(() => {
    console.log("Account Changed!")
    console.log(account)
    cookies.set("accounts", account, cookieOptions)
    setLink('https://www.alienworlds.fun/?accounts='+btoa(JSON.stringify(account)))
  }, [account])

  const handleDeleteAcc = (acc) => {
    let newAcc = [...account].filter((arr) => arr != acc)
    setAccount(newAcc)
  }

  const handleDeleteCookies = () => {
    cookies.remove("accounts")
    setAccount([])
    setInput("")
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center mt-10 px-2 lg:px-0">
      <Head>
        <title>Alienworlds Wax Account Monitor</title>
        <meta name="description" content="Alienworlds Wax Account Monitor" />
      </Head>

      <main className="flex flex-col">
        <span className="text-5xl font-bold mb-3 text-center">AW Wax Account Monitor</span>
        <span className="self-end text-sm">This website is open source on <a className="text-blue-400" href="https://github.com/VectorXz/alienworlds_acc_monitor">GitHub</a></span>

        <div className="flex flex-col rounded-md shadow-lg items-center justify-center p-6 mt-10 mb-2 bg-gray-700">
          <form className="w-full" onSubmit={(e) => { handleAddAcc(e) }}>
            <div className="flex flex-row items-center justify-center w-full">
              <label className="mr-4">WAM Account:</label>
              <input type="text" className="shadow appearance-none w-4/6 rounded py-2 px-3 bg-gray-300 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => { setInput(e.target.value) }} value={input} />
            </div>
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

        {account.length > 0 && 
        <div className="flex flex-col rounded-md shadow-lg items-center justify-center p-3 mb-10 bg-gray-700">
          <span className="text-xl font-bold mb-1">Save this link to view these accounts later</span>
          <input type="text" className="shadow appearance-none w-4/6 rounded py-2 px-3 bg-gray-300 text-gray-800 font-bold leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
          value={link} onClick={(e) => {e.target.select();navigator.clipboard.writeText(link);setCopied(true)}} onFocus={(e) => {e.target.select();}} />
          {copied && <span className="font-bold text-sm mt-3">Copied to clipboard!</span>}
        </div>
        }
      </main>

      <div className="flex flex-col rounded-md items-center justify-center p-6 my-3 w-full lg:w-5/6 bg-gray-700">
        <span className="text-lg font-bold text-center my-1 text-indigo-300">Data will automatically refresh every 60 secs</span>
        <span className="text-lg font-bold text-center my-1 text-indigo-300">Click at trash icon to delete account</span>
        <AccountTable accounts={account} onDelete={handleDeleteAcc} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  console.log(context.query)
  if('accounts' in context.query) {
    const acc = JSON.parse(atob(context.query.accounts))
    console.log(acc)
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