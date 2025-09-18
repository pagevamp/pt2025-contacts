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
// import { setActiveUser } from "../global.js"
import { asciiArt } from "./ascii.js"
import { setActiveUser } from "../global.js"

// --- validations ---
function validateNotEmpty(input: string) {
  if (input.toLowerCase() === "back") return true
  return input.trim() === "" ? "This field cannot be empty" : true
}

function validateEmail(input: string) {
  if (input.toLowerCase() === "back") return true
  const re = /\S+@\S+\.\S+/
  return re.test(input) ? true : "Enter a valid email"
}

function validatePhone(input: string) {
  if (input.toLowerCase() === "back") return true
  const re = /^[0-9]{7,15}$/
  return re.test(input) ? true : "Enter a valid phone number (7-15 digits)"
}

function validateName(input: string) {
  if (input.toLowerCase() === "back") return true
  if (input.trim() === "") return "This field cannot be empty"
  if (input.length > 50) return "Name cannot exceed 50 characters"
  if (/\s/.test(input)) return "Name cannot contain spaces"
  return true
}

export async function manageMenuChoice(action: string) {
  console.clear()
  asciiArt()
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
          message: "Enter the user ID to set as active (or 'back' to cancel):",
          validate: (input) => {
            if (input.toLowerCase() === "back") return true
            return users.find((u) => u.id === input) ? true : "Invalid user ID"
          },
        },
      ])

      if (id.toLowerCase() === "back") {
        console.log("Returning to main menu...")
        break
      }

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
          message: "Enter first name (or 'back' to cancel):",
          validate: validateName,
        },
      ])
      if (userAns.firstName.toLowerCase() === "back") break

      const lastNameAns = await inquirer.prompt([
        {
          type: "input",
          name: "lastName",
          message: "Enter last name (or 'back' to cancel):",
          validate: validateName,
        },
      ])
      if (lastNameAns.lastName.toLowerCase() === "back") break

      const addressAns = await inquirer.prompt([
        {
          type: "input",
          name: "homeAddress",
          message: "Enter home address (or 'back' to cancel):",
          validate: validateNotEmpty,
        },
      ])
      if (addressAns.homeAddress.toLowerCase() === "back") break

      const newUser = await createUser(
        userAns.firstName,
        lastNameAns.lastName,
        addressAns.homeAddress
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
          message: "Enter user ID to update (or 'back' to cancel):",
          validate: (input) => {
            if (input.toLowerCase() === "back") return true
            return users.find((u) => u.id === input) ? true : "Invalid user ID"
          },
        },
      ])
      if (updAns.id.toLowerCase() === "back") break

      const newVals = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter first name (or 'back' to cancel):",
          validate: validateName,
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name (or 'back' to cancel):",
          validate: validateName,
        },
        {
          type: "input",
          name: "homeAddress",
          message: "Enter new home address (or 'back' to cancel):",
          validate: validateNotEmpty,
        },
      ])
      if (
        newVals.firstName.toLowerCase() === "back" ||
        newVals.lastName.toLowerCase() === "back" ||
        newVals.homeAddress.toLowerCase() === "back"
      )
        break

      const updatedUser = await updateUser(
        updAns.id,
        newVals.homeAddress,
        newVals.firstName,
        newVals.lastName
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
          message: "Enter user ID to delete (or 'back' to cancel):",
          validate: (input) => {
            if (input.toLowerCase() === "back") return true
            return users.find((u) => u.id === input) ? true : "Invalid user ID"
          },
        },
      ])
      if (delUserAns.id.toLowerCase() === "back") break

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
          `Adding contact for user ${globalThis.activeUserId}`
        )
      )

      const phoneAns = await inquirer.prompt([
        {
          type: "input",
          name: "phoneNumber",
          message: "Enter phone number (or 'back' to cancel):",
          validate: validatePhone,
        },
      ])
      if (phoneAns.phoneNumber.toLowerCase() === "back") break

      const emailAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter email (or 'back' to cancel):",
          validate: validateEmail,
        },
      ])
      if (emailAns.email.toLowerCase() === "back") break

      const newContact = await createContact(
        phoneAns.phoneNumber,
        emailAns.email,
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
          `Listing contact for user ${globalThis.activeUserId} `
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

      const delContactAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter contact email to delete (or 'back' to cancel):",
          validate: (input) => {
            if (input.toLowerCase() === "back") return true
            return contacts.find((c) => c.email === input)
              ? true
              : "Invalid contact email"
          },
        },
      ])
      if (delContactAns.email.toLowerCase() === "back") break

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

      const updContactAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter contact email to update (or 'back' to cancel):",
          validate: (input) => {
            if (input.toLowerCase() === "back") return true
            return contacts.find((c) => c.email === input)
              ? true
              : "Invalid contact email"
          },
        },
      ])
      if (updContactAns.email.toLowerCase() === "back") break

      const newVals = await inquirer.prompt([
        {
          type: "input",
          name: "phoneNumber",
          message: "Enter new phone number (or 'back' to cancel):",
          validate: validatePhone,
        },
        {
          type: "input",
          name: "newEmail",
          message: "Enter new email (or 'back' to cancel):",
          validate: validateEmail,
        },
      ])
      if (
        newVals.phoneNumber.toLowerCase() === "back" ||
        newVals.newEmail.toLowerCase() === "back"
      )
        break

      const updatedContact = await updateContact(
        updContactAns.email,
        newVals.phoneNumber,
        newVals.newEmail,
        globalThis.activeUserId
      )
      console.log("Contact updated:", updatedContact)
      break
    }
  }
}
