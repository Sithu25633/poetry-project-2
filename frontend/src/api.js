const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function postJSON(path, body, token) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function getJSON(path, token) {
  const res = await fetch(API_BASE + path, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return res.json();
}

export async function uploadFiles(path, files, folder, token) {
  const form = new FormData();
  for (const f of files) form.append('files', f);
  if (folder) form.append('folder', folder);
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: form
  });
  return res.json();
}

export default { postJSON, getJSON, uploadFiles };
