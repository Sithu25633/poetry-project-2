import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Letters({ token }){
  const [letters, setLetters] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>fetchLetters(), [])

  async function fetchLetters(){
    const res = await api.getJSON('/letters', token)
    setLetters(res.letters || [])
  }

  async function submit(){
    await api.postJSON('/letters', { content: text }, token)
    setText('')
    fetchLetters()
  }

  return (
    <div>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full p-2 border rounded" placeholder="Write a love letter..." />
      <div className="mt-2 flex gap-2">
        <button onClick={submit} className="px-3 py-1 bg-pink-500 text-white rounded">Save</button>
      </div>

      <div className="mt-4 space-y-3">
        {letters.map(l=> (
          <div key={l.id} className="p-3 bg-white rounded shadow">
            <div className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</div>
            <div className="mt-1 whitespace-pre-wrap">{l.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
