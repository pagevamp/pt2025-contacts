import { client } from "../db/connect.js"

export type Contact = {
  id: string
  phoneNumber: string
  email:string
  userId: string
}

export async function createContact(phoneNumber: string, email: string , activeUserId: string) {
  const result = await client.query<Contact>(
    `INSERT INTO contacts (phoneNumber,email, userId) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [phoneNumber, email, activeUserId]
  )
  return result.rows[0]
}

export async function listContacts(activeUserId: string) {
  const result = await client.query<Contact>(
    `SELECT * FROM contacts WHERE userId=$1`,
    [activeUserId]
  )
  return result.rows
}

export async function deleteContact(contactId: string, activeUserId: string) {
  const result = await client.query<Contact>(
    `DELETE FROM contacts 
     WHERE id=$1 AND userId=$2 
     RETURNING *`,
    [contactId, activeUserId]
  )
  return result.rows[0]
}

export async function updateContact(
  id: string,
  phoneNumber: string,
  email: string,
  activeUserId: string,
) {
  const result = await client.query<Contact>(
    `UPDATE contacts 
     SET phoneNumber=$2 , email=$3
     WHERE id=$1 AND userId=$4
     RETURNING *`,
    [id, phoneNumber, email, activeUserId]
  )
  return result.rows[0]
}
