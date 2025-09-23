import inquirer from "inquirer"
import { listUsers } from "../models/user.js"
import { mainMenu } from "./menu.js"
import chalk from "chalk"
import { setActiveUser } from "../global.js"
import { asciiArt } from "./ascii.js"

export async function startApp() {
  console.clear()
  asciiArt()
  const users = await listUsers()

  if (users.length === 0) {
    console.log("No users found. Please create one first.")
    return
  }
  console.table(users)

  const { id } = await inquirer.prompt([
    { type: "input", name: "id", message: "Select a user id to continue:" },
  ])

  console.log(chalk.bold.yellowBright(`\nHello ${id}, I am your Contact Manager, Contact Contactson\n`))

  setActiveUser(id)

  await mainMenu()
}
