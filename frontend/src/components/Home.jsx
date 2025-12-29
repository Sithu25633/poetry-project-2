import React, { useState, useEffect } from 'react'
import Photos from './Photos'
import Videos from './Videos'
import Letters from './Letters'
import Counter from './Counter'
import AISection from './AISection'

export default function Home({ token, onSignOut }){
  const [tab, setTab] = useState('photos')

  useEffect(()=>{
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
    // request notification permission and schedule simple notifications while app is open
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') scheduleNotifications()
      })
    }
  },[])

  function scheduleNotifications(){
    // Helper to schedule at next time (hour:minute)
    const scheduleAt = (hour, minute, text) => {
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (target <= now) target.setDate(target.getDate()+1);
      const ms = target - now;
      setTimeout(()=>{
        showNotification(text)
        // schedule again in 24h
        setInterval(()=>showNotification(text), 24*60*60*1000)
      }, ms)
    }

    const randomQuotes = [
      'You are my sunshine.',
      'Every day with you is a gift.',
      'My heart is yours.'
    ]

    // showNotification uses service worker if available
    const showNotification = (body) => {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title: 'Subodasanak', options: { body, tag: 'romantic' } })
      } else {
        new Notification('Subodasanak', { body })
      }
    }

    // Daily fixed ones
    scheduleAt(6, 0, 'Subodasanak mage manika ❤')
    scheduleAt(22, 0, 'Suba ratriyak mage mala ❤')

    // Random quotes up to 3 per day
    const sendRandom = () => {
      const todayKey = 'quotes:' + new Date().toISOString().slice(0,10)
      const used = JSON.parse(localStorage.getItem(todayKey) || '[]')
      if (used.length >= 3) return
      const q = randomQuotes[Math.floor(Math.random()*randomQuotes.length)]
      showNotification(q + ' — for your Kash ❤')
      used.push(q)
      localStorage.setItem(todayKey, JSON.stringify(used))
    }
    // schedule a few random times while app is open
    setInterval(sendRandom, 1000*60*60) // every hour while open
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Subodasanak mage manika ❤</h1>
        <div>
          <button onClick={onSignOut} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
        </div>
      </header>

      <nav className="flex gap-2 mb-4">
        <button className="px-3 py-2 bg-white rounded shadow" onClick={()=>setTab('photos')}>Photos</button>
        <button className="px-3 py-2 bg-white rounded shadow" onClick={()=>setTab('videos')}>Videos</button>
        <button className="px-3 py-2 bg-white rounded shadow" onClick={()=>setTab('letters')}>Letters</button>
        <button className="px-3 py-2 bg-white rounded shadow" onClick={()=>setTab('counter')}>Love Counter</button>
        <button className="px-3 py-2 bg-white rounded shadow" onClick={()=>setTab('ai')}>Gemini</button>
      </nav>

      <main>
        {tab==='photos' && <Photos token={token} />}
        {tab==='videos' && <Videos token={token} />}
        {tab==='letters' && <Letters token={token} />}
        {tab==='counter' && <Counter token={token} />}
        {tab==='ai' && <AISection token={token} />}
      </main>
    </div>
  )
}
