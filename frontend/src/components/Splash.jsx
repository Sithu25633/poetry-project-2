import React from 'react'
import { motion } from 'framer-motion'

export default function Splash(){
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-pink-200 to-red-200">
      <motion.div initial={{ scale: 0.6, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration: 0.8 }} className="p-8 rounded-xl bg-white/60 backdrop-blur-md shadow-lg text-center">
        <h1 className="text-2xl font-bold">Subodasanak mage manika ❤</h1>
        <p className="mt-2 text-sm">A private place for your memories</p>
      </motion.div>
    </div>
  )
}
