import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

app.use(express.json({ limit: '50mb' }))

let Section = null

try {
  const mongoose = (await import('mongoose')).default
  const sectionSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  })
  Section = mongoose.model('Section', sectionSchema)

  await mongoose.connect(MONGODB_URI)
  console.log('Terhubung ke MongoDB Atlas')
} catch (err) {
  console.error('MongoDB tidak tersedia:', err.message)
}

app.get('/api/data', async (_req, res) => {
  if (!Section) return res.json({})
  try {
    const sections = await Section.find()
    const data = {}
    for (const s of sections) data[s.key] = s.value
    res.json(data)
  } catch (e) {
    console.error('GET /api/data error:', e)
    res.status(500).json({ error: 'Gagal membaca data' })
  }
})

app.post('/api/data', async (req, res) => {
  if (!Section) return res.status(503).json({ error: 'Database tidak tersedia' })
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
    if (ops.length > 0) await Section.bulkWrite(ops)
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

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}, MongoDB: ${Section ? 'terhubung' : 'tidak tersedia'}`)
})
