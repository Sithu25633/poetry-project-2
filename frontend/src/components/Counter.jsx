import React, { useEffect, useState } from 'react'
import api from '../api'
import dayjs from 'dayjs'

export default function Counter({ token }){
  const [counter, setCounter] = useState(null)
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(()=>{ fetchCounter(); const iv = setInterval(()=>setNow(Date.now()), 1000); return ()=>clearInterval(iv) }, [])

  async function fetchCounter(){
    const res = await api.getJSON('/counter', token)
    setCounter(res.counter)
  }

  async function save(){
    await api.postJSON('/counter', { title, start_date: start }, token)
    fetchCounter()
  }

  function renderLive(){
    if (!counter) return <div>No counter set yet</div>
    const startMs = new Date(counter.start_date).getTime()
    const diff = now - startMs
    const days = Math.floor(diff / (1000*60*60*24))
    const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60))
    const mins = Math.floor((diff%(1000*60*60))/(1000*60))
    const secs = Math.floor((diff%(1000*60))/1000)
    return (
      <div className="p-4 rounded bg-white/60 shadow text-center">
        <h3 className="font-semibold">{counter.title}</h3>
        <div className="text-2xl mt-2">{days}d {hours}h {mins}m {secs}s</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title e.g., Our Love" className="border p-2 rounded w-full" />
        <input value={start} onChange={(e)=>setStart(e.target.value)} placeholder="Start date (YYYY-MM-DD)" className="border p-2 rounded w-full mt-2" />
        <button onClick={save} className="mt-2 px-3 py-1 bg-red-400 text-white rounded">Save</button>
      </div>

      {renderLive()}
    </div>
  )
}
