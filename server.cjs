const express = require('express')
const { join } = require('path')
const { readFileSync, writeFileSync, existsSync } = require('fs')

const DATA_FILE = join(__dirname, 'data.json')

if (!existsSync(DATA_FILE)) {
  writeFileSync(DATA_FILE, '{}', 'utf-8')
  console.log('data.json dibuat')
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '50mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

function readData() {
  try {
    if (!existsSync(DATA_FILE)) return {}
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch (e) {
    console.error('Gagal baca data.json:', e.message)
    return {}
  }
}

function writeData(data) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (e) {
    console.error('Gagal tulis data.json:', e.message)
    return false
  }
}

app.get('/api/data', (req, res) => {
  res.json(readData())
})

app.post('/api/data', (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object')
    return res.status(400).json({ error: 'Data tidak valid' })
  const current = readData()
  if (!writeData({ ...current, ...body }))
    return res.status(500).json({ error: 'Gagal menyimpan data' })
  res.json({ success: true })
})

app.use(express.static(join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
