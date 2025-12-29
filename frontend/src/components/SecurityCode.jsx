import React, { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

export default function SecurityCode({ onOk }){
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  async function submit(){
    try {
      const res = await api.postJSON('/auth/verify-code', { code })
      if (res.ok) return onOk()
      setShake(true); setTimeout(() => setShake(false), 600)
    } catch (err) {
      setShake(true); setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 to-pink-200">
      <motion.div animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}} className="bg-white/80 p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-semibold">Enter Security Code</h2>
        <input autoFocus value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code" className="mt-4 w-full p-2 rounded border" />
        <button onClick={submit} className="mt-4 w-full bg-pink-500 text-white p-2 rounded">Enter</button>
      </motion.div>
    </div>
  )
}
