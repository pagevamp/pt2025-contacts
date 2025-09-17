import { Pool } from "pg"

export const pool = new Pool({
  host: "localhost",
  user: "stutiupreti",
  database: "contactdb",
  port: 5432,
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
