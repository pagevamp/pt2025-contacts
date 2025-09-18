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
import { asciiArt } from "./ascii.js"
import { setActiveUser } from "../global.js"
import { ContactSchema, UserSchema } from "../types/schema.js"
import { zodPtomptValidator } from "./validation.js"

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
          name: "firstname",
          message: "Enter first name (or 'back' to cancel):",
          validate: zodPtomptValidator(UserSchema.shape.firstname),
        },
      ])
      if (userAns.firstname.toLowerCase() === "back") break

      const lastNameAns = await inquirer.prompt([
        {
          type: "input",
          name: "lastname",
          message: "Enter last name (or 'back' to cancel):",
          validate: zodPtomptValidator(UserSchema.shape.lastname),
        },
      ])
      if (lastNameAns.lastname.toLowerCase() === "back") break

      const addressAns = await inquirer.prompt([
        {
          type: "input",
          name: "homeaddress",
          message: "Enter home address (or 'back' to cancel):",
          validate: zodPtomptValidator(UserSchema.shape.homeaddress),
        },
      ])
      if (addressAns.homeaddress.toLowerCase() === "back") break

      const newUser = await createUser(
        userAns.firstname,
        lastNameAns.lastname,
        addressAns.homeaddress
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
          name: "firstname",
          message: "Enter first name (or 'back' to cancel):",
          validate: zodPtomptValidator(UserSchema.shape.firstname),
        },
        {
          type: "input",
          name: "lastname",
          message: "Enter last name (or 'back' to cancel):",
          validate: zodPtomptValidator(UserSchema.shape.lastname),
        },
        {
          type: "input",
          name: "homeaddress",
          message: "Enter new home address (or 'back' to cancel):",

          validate: zodPtomptValidator(UserSchema.shape.homeaddress),
        },
      ])
      if (
        newVals.firstname.toLowerCase() === "back" ||
        newVals.lastname.toLowerCase() === "back" ||
        newVals.homeaddress.toLowerCase() === "back"
      )
        break

      const updatedUser = await updateUser(
        updAns.id,
        newVals.homeaddress,
        newVals.firstname,
        newVals.lastname
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
          name: "phonenumber",
          message: "Enter phone number (or 'back' to cancel):",
          validate: zodPtomptValidator(ContactSchema.shape.phonenumber),
        },
      ])
      if (phoneAns.phonenumber.toLowerCase() === "back") break

      const emailAns = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter email (or 'back' to cancel):",

          validate: zodPtomptValidator(ContactSchema.shape.email),
        },
      ])
      if (emailAns.email.toLowerCase() === "back") break

      const newContact = await createContact(
        phoneAns.phonenumber,
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

      const phoneAns = await inquirer.prompt([
        {
          type: "input",
          name: "phonenumber",
          message: "Enter phone number (or 'back' to cancel):",
          validate: zodPtomptValidator(ContactSchema.shape.phonenumber),
        },
      ])
      if (phoneAns.phonenumber.toLowerCase() === "back") break

      const newVals = await inquirer.prompt([
        {
          type: "input",
          name: "newEmail",
          message: "Enter new email (or 'back' to cancel):",

          validate: zodPtomptValidator(ContactSchema.shape.email),
        },
      ])
      if (newVals.newEmail.toLowerCase() === "back") break

      const updatedContact = await updateContact(
        updContactAns.email,
        phoneAns.phonenumber,
        newVals.newEmail,
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
