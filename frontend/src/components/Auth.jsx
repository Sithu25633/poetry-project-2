import React, { useState } from 'react'
import api from '../api'

export default function Auth({ onAuth }){
  const [email, setEmail] = useState('couple@love')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')

  async function submit(){
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const res = await api.postJSON(path, { email, password })
      if (res.token) onAuth(res.token)
      else alert(res.error || 'Unknown error')
    } catch (err) { alert(err.message) }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-yellow-100 to-pink-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-3 w-full p-2 border rounded" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full p-2 border rounded" />
        <button onClick={submit} className="mt-3 w-full bg-red-400 text-white p-2 rounded">{mode === 'login' ? 'Login' : 'Create'}</button>
        <div className="mt-2 text-sm text-center">
          <button onClick={()=>setMode(mode==='login'?'register':'login')} className="underline">{mode==='login'?'Register an account':'Back to login'}</button>
        </div>
      </div>
    </div>
  )
}
