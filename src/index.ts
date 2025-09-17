import { connectDB, disconnectDB } from "./db/connect.js"
import { startApp } from "./cli/start.js"

async function run() {
  await connectDB()
  await startApp()
  await disconnectDB()
}

run()
