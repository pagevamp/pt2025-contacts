import inquirer from "inquirer"
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
} from "../models/user.js"
import {
  createContact,
  listContacts,
  deleteContact,
  updateContact,
} from "../models/contact.js"
import chalk from "chalk"
import { setActiveUser } from "../global.js"

// --- validations ---
function validateNotEmpty(input: string) {
  return input.trim() === "" ? "This field cannot be empty" : true
}

function validateEmail(input: string) {
  const re = /\S+@\S+\.\S+/
  return re.test(input) ? true : "Enter a valid email"
}

function validatePhone(input: string) {
  const re = /^[0-9]{7,15}$/
  return re.test(input) ? true : "Enter a valid phone number (7-15 digits)"
}

function validateName(input: string) {
  if (input.trim() === "") return "This field cannot be empty"
  if (input.length > 50) return "Name cannot exceed 50 characters"
  if (/\s/.test(input)) return "Name cannot contain spaces"
  return true
}

export async function manageMenuChoice(action: string) {
  console.clear()

  switch (action) {
    // -------- USER MANAGEMENT ----------

    case "Switch Active User": {
      const users = await listUsers()
      if (users.length === 0) {
        console.log("No users found. Please add a user first.")
        break
      }

      console.table(users)

      const { id } = await inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the user ID to set as active(or 'back'):",
          validate: (input) =>
            users.find((u) => u.id === input) ? true : "Invalid user ID",
        },
      ])

      setActiveUser(id)
      console.log(
        chalk.bold.yellowBright(
          `\nHello ${id}, I am your Contact Manager, Contact Contactson\n`
        )
      )

      break
    }

    case "Add User": {
      const userAns = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter first name:",
          validate: validateName,
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name:",
          validate: validateName,
        },
        {
          type: "input",
          name: "homeAddress",
          message: "Enter home address:",
          validate: validateNotEmpty,
        },
      ])

      const newUser = await createUser(
        userAns.firstName,
        userAns.lastName,
        userAns.homeAddress
      )
      console.log("User added:", newUser)
      break
    }

    case "List Users": {
      const users = await listUsers()
      console.table(users)
      break
    }

    case "Update User": {
      const users = await listUsers()
      console.table(users)

      const updAns = await inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Enter user ID to update:",
          validate: (input) =>
            users.find((u) => u.id === input) ? true : "Invalid user ID",
        },
        {
          type: "input",
          name: "firstName",
          message: "Enter first name:",
          validate: validateName,
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name:",
          validate: validateName,
        },
        {
          type: "input",
          name: "homeAddress",
          message: "Enter new home address:",
          validate: validateNotEmpty,
        },
      ])

      const updatedUser = await updateUser(
        updAns.id,
        updAns.homeAddress,
        updAns.firstName,
        updAns.lastName
      )
      console.log("User updated:", updatedUser)
      break
    }

    case "Delete User": {
      const users = await listUsers()
      console.table(users)

      const delUserAns = await inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Enter user ID to delete:",
          validate: (input) =>
            users.find((u) => u.id === input) ? true : "Invalid user ID",
        },
      ])

      await deleteUser(delUserAns.id)
      console.log("User deleted")
      break
    }

    // -------- CONTACT MANAGEMENT ----------

    case "Add Contact": {
      if (!globalThis.activeUserId) {
        console.log("Please select an active user first.")
        break
      }
      console.log(
        chalk.bold.yellowBright(
          `adding contact for user ${globalThis.activeUserId}`
        )
      )
      const contactAns = await inquirer.prompt([
        {
          type: "input",
          name: "phoneNumber",
          message: "Enter phone number:",
          validate: validatePhone,
        },
        {
          type: "input",
          name: "email",
          message: "Enter email:",
          validate: validateEmail,
        },
      ])

      const newContact = await createContact(
        contactAns.phoneNumber,
        contactAns.email,
        globalThis.activeUserId
      )
      console.log("Contact added:", newContact)
      break
    }

    case "List Contacts": {
      if (!globalThis.activeUserId) {
        console.log("Please select an active user first.")
        break
      }
      console.log(
        chalk.bold.yellowBright(
          `Listing contact for user ${globalThis.activeUserId}`
        )
      )
      const contacts = await listContacts(globalThis.activeUserId)
      console.table(contacts)
      break
    }

    case "Delete Contact": {
      if (!globalThis.activeUserId) {
        console.log("Please select an active user first.")
        break
      }

      const contacts = await listContacts(globalThis.activeUserId)
      console.table(contacts)
      console.log(
        chalk.bold.yellowBright(
          `Deleting contact for user ${globalThis.activeUserId}`
        )
      )
      const delContactAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter contact email to delete:",
          validate: (input) =>
            contacts.find((c) => c.email === input)
              ? true
              : "Invalid contact email",
        },
      ])

      const deletedContact = await deleteContact(
        delContactAns.email,
        globalThis.activeUserId
      )
      console.log("Contact deleted:", deletedContact)
      break
    }

    case "Update Contact": {
      if (!globalThis.activeUserId) {
        console.log("Please select an active user first.")
        break
      }

      const contacts = await listContacts(globalThis.activeUserId)
      console.table(contacts)
      console.log(
        chalk.bold.yellowBright(
          `Updating contact for user ${globalThis.activeUserId}`
        )
      )
      const updContactAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter contact email to update:",
          validate: (input) =>
            contacts.find((c) => c.email === input)
              ? true
              : "Invalid contact email",
        },
        {
          type: "input",
          name: "phoneNumber",
          message: "Enter new phone number:",
          validate: validatePhone,
        },
        {
          type: "input",
          name: "email",
          message: "Enter new email:",
          validate: validateEmail,
        },
      ])

      const updatedContact = await updateContact(
        updContactAns.phoneNumber,
        updContactAns.email,
        globalThis.activeUserId
      )
      console.log("Contact updated:", updatedContact)
      break
    }

    case "Exit": {
      console.log("Until Next Time!")
      process.exit(0)
    }
  }
}

// const inquirer = require('inquirer');

// async function askQuestion() {
//   const answer = await inquirer.prompt([
//     {
//       name: 'favoriteColor',
//       type: 'input',
//       message: 'What is your favorite color?',
//       validate: (input) => {
//         if (input.toLowerCase() === 'blue') {
//           return true; // Valid input
//         } else if (input.toLowerCase() === 'green') {
//           return true; // Valid input
//         } else if (input.toLowerCase() === 'red') {
//           return true; // Valid input
//         } else {
//           return 'Please enter "blue", "green", or "red".'; // Invalid input with error message
//         }
//       },
//     },
//   ]);

//   console.log(`Your favorite color is: ${answer.favoriteColor}`);
// }

// askQuestion();
