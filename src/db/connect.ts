import { Pool } from "pg"
import * as zod from "zod"
import "dotenv/config"

export const pool = new Pool({
  host: zod.string().parse(process.env.DB_HOST),
  user: zod.string().parse(process.env.DB_USER),
  database: zod.string().parse(process.env.DB_NAME),
  port: Number(process.env.DB_PORT || 3001),
  max: 20,
})

export async function connectDB() {
  await pool.connect()
  console.log("Connected to PostgreSQL")
}

export async function disconnectDB() {
  await pool.end()
  console.log("Disconnected from PostgreSQL")
}
