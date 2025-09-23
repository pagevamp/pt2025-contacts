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
    await mainMenu()
  } else {
    console.table(users)
  }

  const { username } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Select a user username to continue:",
      validate: (input) => {
        if (input.toLowerCase() === "back") return true
        return users.find((u) => u.username === input)
          ? true
          : "Invalid username"
      },
    },
  ])

  console.log(
    chalk.bold.yellowBright(
      `\nHello ${username}, I am your Contact Manager, Contact Contactperson\n`
    )
  )

  setActiveUser(username)

  await mainMenu()
}
