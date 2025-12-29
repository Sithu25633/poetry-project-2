import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Videos({ token }){
  const [files, setFiles] = useState([])
  const [folder, setFolder] = useState('root')

  useEffect(()=>fetchList(), [])

  async function fetchList(){
    const res = await api.getJSON('/media', token)
    setFiles(res.media || [])
  }

  async function onFiles(e){
    const f = Array.from(e.target.files)
    await api.uploadFiles('/media/upload', f, folder, token)
    fetchList()
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input placeholder="folder" value={folder} onChange={(e)=>setFolder(e.target.value)} className="border p-2 rounded" />
        <input multiple accept="video/*" type="file" onChange={onFiles} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {files.filter(f=>f.mimetype.startsWith('video/')).map(f=> (
          <video key={f.id} controls className="w-full max-h-56 rounded shadow">
            <source src={`http://localhost:4000/media/file/${f.filename}`} type={f.mimetype} />
          </video>
        ))}
      </div>
    </div>
  )
}
