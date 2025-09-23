import { connectDB, disconnectDB } from "./db/connect.js"
import { startApp } from "./cli/start.js"

async function run() {
  await connectDB()
  await startApp()
  await disconnectDB()
}

const handleDisconnection = async () => {
  try {
    console.log("Closing database connection...")
    await disconnectDB()
  } catch (err) {
    console.error("Error during DB disconnect:", err)
  } finally {
    process.exit(0)
  }
}

// Event handlers for DB disconnection on Ctrl+C / errors / terminations
process.on("SIGINT", handleDisconnection)
process.on("SIGTERM", handleDisconnection)
process.on("uncaughtException", async (err: unknown) => {
  console.error("Uncaught Exception:", err)
  await handleDisconnection()
})
process.on("unhandledRejection", async (err: unknown) => {
  console.error("Unhandled Rejection:", err)
  await handleDisconnection()
})
run()
