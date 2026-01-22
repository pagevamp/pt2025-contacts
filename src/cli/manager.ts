import inquirer from 'inquirer'
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  getUserByUsername,
} from '../models/user.js'
import {
  createContact,
  listContacts,
  deleteContact,
  updateContact,
} from '../models/contact.js'
import chalk from 'chalk'
import { asciiArt } from './ascii.js'
import { setActiveUser } from '../global.js'
import { ContactSchema, UserSchema } from '../types/schema.js'
import { zodPromptValidator } from './validation.js'
import { generateUserAdventure } from '../lib/gemini.js'
import figlet from 'figlet'

export async function manageMenuChoice(action: string) {
  console.clear()
  asciiArt()
  switch (action) {
    // -------- USER MANAGEMENT ----------

    case 'Switch Active User': {
      const users = await listUsers()
      if (users.length === 0) {
        console.log('No users found. Please add a user first.')
        break
      }

      console.table(users)

      const { username } = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: "Enter the username to set as active (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') return true
            return users.find(u => u.username === input)
              ? true
              : 'Invalid username'
          },
        },
      ])

      if (username.toLowerCase() === 'back') {
        console.log('Returning to main menu...')
        break
      }

      setActiveUser(username)

      const name = await figlet.text(username, {
        font: 'Standard',
        whitespaceBreak: true,
      })
      console.log(
        chalk.bold.yellowBright(
          `Hello 
          \n  
                ${name} 
          \nI am your Contact Manager, Contact Contactson\n`
        )
      )

      break
    }

    case 'Add User': {
      const users = await listUsers()
      const usernameAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: "Enter username (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') return true
            if (users.find(u => u.username === input)) {
              return 'Username already exists. Please choose another.'
            }
            zodPromptValidator(UserSchema.shape.username)
            return true
          },
        },
      ])
      if (usernameAns.username.toLowerCase() === 'back') break

      const userAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstname',
          message: "Enter first name (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.firstname),
        },
      ])
      if (userAns.firstname.toLowerCase() === 'back') break

      const lastNameAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'lastname',
          message: "Enter last name (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.lastname),
        },
      ])
      if (lastNameAns.lastname.toLowerCase() === 'back') break

      const addressAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'homeaddress',
          message: "Enter home address (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.homeaddress),
        },
      ])
      if (addressAns.homeaddress.toLowerCase() === 'back') break

      const descAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: "Enter description (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.description),
        },
      ])
      if (descAns.description.toLowerCase() === 'back') break

      const oweAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'owes_me',
          message: "Enter money owed (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.owes_me),
        },
      ])
      if (oweAns.owes_me.toLowerCase() === 'back') break

      const newUser = await createUser(
        usernameAns.username,
        userAns.firstname,
        lastNameAns.lastname,
        addressAns.homeaddress,
        descAns.description,
        oweAns.owes_me
      )
      console.log('User added:', newUser)
      break
    }

    case 'List Users': {
      const users = await listUsers()
      console.table(users)
      break
    }

    case 'Update User': {
      const users = await listUsers()
      console.table(users)

      const updAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: "Enter username to update (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') return true
            return users.find(u => u.username === input)
              ? true
              : 'Invalid username'
          },
        },
      ])
      if (updAns.username.toLowerCase() === 'back') break

      const newVals = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstname',
          message: "Enter first name (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.firstname),
        },
        {
          type: 'input',
          name: 'lastname',
          message: "Enter last name (or 'back' to cancel):",
          validate: zodPromptValidator(UserSchema.shape.lastname),
        },
        {
          type: 'input',
          name: 'homeaddress',
          message: "Enter new home address (or 'back' to cancel):",

          validate: zodPromptValidator(UserSchema.shape.homeaddress),
        },
        {
          type: 'input',
          name: 'description',
          message: "Enter new description (or 'back' to cancel):",

          validate: zodPromptValidator(UserSchema.shape.description),
        },
        {
          type: 'input',
          name: 'owes_me',
          message: "Enter new owes_me (or 'back' to cancel):",

          validate: zodPromptValidator(UserSchema.shape.owes_me),
        },
      ])
      if (
        newVals.firstname.toLowerCase() === 'back' ||
        newVals.lastname.toLowerCase() === 'back' ||
        newVals.homeaddress.toLowerCase() === 'back' ||
        newVals.description.toLowerCase() === 'back' ||
        newVals.owes_me.toLowerCase() === 'back'
      )
        break

      const updatedUser = await updateUser(
        updAns.username,
        newVals.homeaddress,
        newVals.firstname,
        newVals.lastname,
        newVals.description,
        newVals.owes_me
      )
      console.log('User updated:', updatedUser)
      break
    }

    case 'Delete User': {
      const users = await listUsers()
      console.table(users)

      const delUserAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: "Enter username to delete (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') {
              return true
            }
            return users.find(
              u =>
                u.username === input && u.username !== globalThis.activeUserId
            )
              ? true
              : 'Invalid username'
          },
        },
      ])
      if (delUserAns.username.toLowerCase() === 'back') break

      await deleteUser(delUserAns.username)
      console.log('User deleted')
      break
    }

    case 'Generate Adventure': {
      if (!globalThis.activeUserId) {
        console.log('Please select an active user first.')
        break
      }

      const activeUser = await getUserByUsername(globalThis.activeUserId)
      if (!activeUser) {
        console.log('Active user not found.')
        break
      }

      if (!activeUser.description || activeUser.description.trim().length < 5) {
        console.log(
          chalk.yellow(
            '\n⚠️  User description is too short for adventure generation.'
          )
        )
        console.log(
          chalk.yellow('   Please update the user description first.')
        )
        break
      }

      if (!activeUser.owes_me || activeUser.owes_me.trim().length === 0) {
        console.log(
          chalk.yellow(
            '\n⚠️  No "owes me" amount set for adventure generation.'
          )
        )
        console.log(chalk.yellow('   Please set the money owed first.'))
        break
      }

      console.log(`\nGenerating adventure for ${activeUser.username}...`)

      try {
        const adventure = await generateUserAdventure(
          activeUser.description,
          activeUser.owes_me,
          activeUser.username
        )
        console.log('\n--- Your Adventure ---\n')
        console.log(adventure)
        console.log('\n---------------------\n')
      } catch (err) {
        console.error(
          'Failed to generate adventure:',
          err instanceof Error ? err.message : err
        )
      }
      break
    }

    // -------- CONTACT MANAGEMENT ----------

    case 'Add Contact': {
      if (!globalThis.activeUserId) {
        console.log('Please select an active user first.')
        break
      }
      console.log(
        chalk.bold.yellowBright(
          `Adding contact for user ${globalThis.activeUserId}`
        )
      )

      const phoneAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'phonenumber',
          message: "Enter phone number (or 'back' to cancel):",
          validate: zodPromptValidator(ContactSchema.shape.phonenumber),
        },
      ])
      if (phoneAns.phonenumber.toLowerCase() === 'back') break

      const emailAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: "Enter email (or 'back' to cancel):",

          validate: zodPromptValidator(ContactSchema.shape.email),
        },
      ])
      if (emailAns.email.toLowerCase() === 'back') break

      const newContact = await createContact(
        phoneAns.phonenumber,
        emailAns.email,
        globalThis.activeUserId
      )
      console.log('Contact added:', newContact)
      break
    }

    case 'List Contacts': {
      if (!globalThis.activeUserId) {
        console.log('Please select an active user first.')
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

    case 'Delete Contact': {
      if (!globalThis.activeUserId) {
        console.log('Please select an active user first.')
        break
      }

      const contacts = await listContacts(globalThis.activeUserId)
      console.table(contacts)

      const delContactAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: "Enter contact email to delete (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') return true
            return contacts.find(c => c.email === input)
              ? true
              : 'Invalid contact email'
          },
        },
      ])
      if (delContactAns.email.toLowerCase() === 'back') break

      const deletedContact = await deleteContact(
        delContactAns.email,
        globalThis.activeUserId
      )
      console.log('Contact deleted:', deletedContact)
      break
    }

    case 'Update Contact': {
      if (!globalThis.activeUserId) {
        console.log('Please select an active user first.')
        break
      }

      const contacts = await listContacts(globalThis.activeUserId)
      console.table(contacts)

      const updContactAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: "Enter contact email to update (or 'back' to cancel):",
          validate: input => {
            if (input.toLowerCase() === 'back') return true
            return contacts.find(c => c.email === input)
              ? true
              : 'Invalid contact email'
          },
        },
      ])
      if (updContactAns.email.toLowerCase() === 'back') break

      const phoneAns = await inquirer.prompt([
        {
          type: 'input',
          name: 'phonenumber',
          message: "Enter phone number (or 'back' to cancel):",
          validate: zodPromptValidator(ContactSchema.shape.phonenumber),
        },
      ])
      if (phoneAns.phonenumber.toLowerCase() === 'back') break

      const newVals = await inquirer.prompt([
        {
          type: 'input',
          name: 'newEmail',
          message: "Enter new email (or 'back' to cancel):",
          validate: zodPromptValidator(ContactSchema.shape.email),
        },
      ])
      if (newVals.newEmail.toLowerCase() === 'back') break

      const updatedContact = await updateContact(
        updContactAns.email,
        phoneAns.phonenumber,
        newVals.newEmail,
        globalThis.activeUserId
      )
      console.log('Contact updated:', updatedContact)
      break
    }

    case 'Exit': {
      console.log('Until Next Time!')
      process.exit(0)
    }
  }
}
