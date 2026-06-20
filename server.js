import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/honda-nagamotor'

app.use(express.json({ limit: '50mb' }))

const sectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
})

const Section = mongoose.model('Section', sectionSchema)

app.get('/api/data', async (_req, res) => {
  try {
    const sections = await Section.find()
    const data = {}
    for (const s of sections) {
      data[s.key] = s.value
    }
    res.json(data)
  } catch (e) {
    console.error('GET /api/data error:', e)
    res.status(500).json({ error: 'Gagal membaca data' })
  }
})

app.post('/api/data', async (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Data tidak valid' })
    }
    const ops = Object.entries(body).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value, updatedAt: new Date() } },
        upsert: true,
      },
    }))
    await Section.bulkWrite(ops)
    res.json({ success: true })
  } catch (e) {
    console.error('POST /api/data error:', e)
    res.status(500).json({ error: 'Gagal menyimpan data' })
  }
})

app.use(express.static(join(__dirname, 'dist')))

app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

async function start() {
  await mongoose.connect(MONGODB_URI)
  console.log('Terhubung ke MongoDB Atlas')

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Gagal start server:', err)
  process.exit(1)
})
