import inquirer from "inquirer"
import { listUsers } from "../models/user.js"
import { mainMenu } from "./menu.js"
import { setActiveUser } from "./manager.js"
import chalk from "chalk"

export async function startApp() {
  const users = await listUsers()

  if (users.length === 0) {
    console.log("No users found. Please create one first.")
    return
  }

  console.table(users)

  const { id } = await inquirer.prompt([
    { type: "input", name: "id", message: "Select a user id to continue:" },
  ])

  console.log(chalk.bold.bgYellowBright(`Hello ${id}, I am your Contact Manager, Contact Contactson`))

  setActiveUser(id)

  await mainMenu()
}
