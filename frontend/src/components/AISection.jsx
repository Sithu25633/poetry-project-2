import React, { useState } from 'react'
import api from '../api'

export default function AISection({ token }){
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')

  async function generate(){
    const res = await api.postJSON('/ai/generate', { prompt }, token)
    setResult(res.result || JSON.stringify(res))
  }

  return (
    <div>
      <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="w-full p-2 border rounded" placeholder="Write what you want the AI to generate" />
      <div className="mt-2 flex gap-2">
        <button onClick={generate} className="px-3 py-1 bg-pink-500 text-white rounded">Generate</button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-white rounded shadow whitespace-pre-wrap">{result}</div>
      )}
    </div>
  )
}
