import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Photos({ token }){
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(null)
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
        <input multiple accept="image/*" type="file" onChange={onFiles} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {files.filter(f=>f.mimetype.startsWith('image/')).map(f=> (
          <img key={f.id} src={`http://localhost:4000/media/file/${f.filename}`} alt={f.originalname} className="w-full h-28 object-cover rounded" onClick={()=>setSelected(f)} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center" onClick={()=>setSelected(null)}>
          <img src={`http://localhost:4000/media/file/${selected.filename}`} className="max-h-[90%] rounded shadow" />
        </div>
      )}
    </div>
  )
}
