import React, { useEffect, useState } from 'react'
import Splash from './components/Splash'
import SecurityCode from './components/SecurityCode'
import Auth from './components/Auth'
import Home from './components/Home'
import api from './api'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [securityOk, setSecurityOk] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    // disable right-click
    const onCtx = (e) => e.preventDefault()
    window.addEventListener('contextmenu', onCtx)
    return () => window.removeEventListener('contextmenu', onCtx)
  }, [])

  if (showSplash) return <Splash />
  if (!securityOk) return <SecurityCode onOk={() => setSecurityOk(true)} />
  if (!token) return <Auth onAuth={(t) => { setToken(t); localStorage.setItem('token', t) }} />
  return <Home token={token} onSignOut={() => { localStorage.removeItem('token'); setToken(null) }} />
}

export default App
