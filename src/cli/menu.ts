import inquirer from "inquirer"
import { manageMenuChoice } from "./manager.js"

export async function mainMenu() {
  while (true) {
    const { management } = await inquirer.prompt([
      {
        type: "list",
        name: "management",
        message: "",
        choices: [
          "Switch Active User",
          "Add User",
          "List Users",
          "Update User",
          "Delete User",
          "Add Contact",
          "List Contacts",
          "Delete Contact",
          "Update Contact",
          "Exit",
        ],
      },
    ])

    await manageMenuChoice(management)
  }
}
