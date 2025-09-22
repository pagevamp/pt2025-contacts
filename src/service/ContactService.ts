import type { IContact } from '../models/types.js'
import { ContactRepository } from '../repository/ContactRepository.js'

export class ContactService {
  static async addContact(contact: IContact): Promise<IContact | null> {
    // console.log('the userid from service is: ', contact.user_id, contact.email)
    const emailExists = await ContactRepository.findByEmail(
      contact.user_id,
      contact.email,
    )
    // console.log('the email exist is: ', emailExists)
    const numberExists = await ContactRepository.findByContactNumber(
      contact.user_id,
      contact.contact_number,
    )
    // console.log('the contact exist is: ', numberExists)
    if (emailExists) {
      return null
    }
    if (numberExists) {
      return null
    }

    return await ContactRepository.create(contact)
  }

  static async listContacts(user_id: string) {
    return await ContactRepository.findUsers(user_id)
  }

  static async updateContact(
    contact_id: string,
    updates: Partial<IContact>,
    user_id: string,
  ) {
    const numberExist = await ContactRepository.updateValidateNumber(
      user_id,
      updates.contact_number!,
      contact_id,
    )
    const emailExist = await ContactRepository.updateValidateEmail(
      user_id,
      updates.email!,
      contact_id,
    )
    console.log('the number exist is: ', numberExist)
    console.log('the email exist is: ', emailExist)
    if (numberExist) {
      console.log('Cannot udpate! Contact with this number already exists.')
      return null
    }
    if (emailExist) {
      console.log('Contact with this email already exists.')
      return null
    }
    return await ContactRepository.update(contact_id, updates, user_id)
  }

  static async deleteContact(contact_id: string, user_id: string) {
    return await ContactRepository.delete(contact_id, user_id)
  }
}
