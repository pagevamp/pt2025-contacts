import { Client } from "pg"

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "contactdb",
  user: "stutiupreti",
})

export async function connectDB() {
  await client.connect()
  console.log("Connected to PostgreSQL")
}

export async function disconnectDB() {
  await client.end()
  console.log("Disconnected from PostgreSQL")
}
