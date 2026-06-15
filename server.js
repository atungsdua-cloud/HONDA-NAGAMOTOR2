import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = join(__dirname, 'data.json')

app.use(express.json({ limit: '50mb' }))

app.get('/api/data', (_req, res) => {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, 'utf-8')
      res.json(JSON.parse(data))
    } else {
      res.json({})
    }
  } catch (e) {
    res.status(500).json({ error: 'Gagal membaca data' })
  }
})

app.post('/api/data', (req, res) => {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2))
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Gagal menyimpan data' })
  }
})

app.use(express.static(join(__dirname, 'dist')))

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
