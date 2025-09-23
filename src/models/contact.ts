import { pool } from "../db/connect.js"

export type Contact = {
  id: string
  phoneNumber: string
  email: string
  userId: string
  userRef: string
}

export async function createContact(
  phoneNumber: string,
  email: string,
  activeUserId: string
) {
  const result = await pool.query<Contact>(
    `INSERT INTO contacts (phoneNumber,email, userRef) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [phoneNumber, email, activeUserId]
  )
  return result.rows[0]
}

export async function listContacts(activeUserId: string) {
  const result = await pool.query<Contact>(
    `SELECT * FROM contacts WHERE userRef=$1`,
    [activeUserId]
  )
  return result.rows
}

export async function deleteContact(email: string, activeUserId: string) {
  const result = await pool.query<Contact>(
    `DELETE FROM contacts 
     WHERE email=$1 AND userRef=$2 
     RETURNING *`,
    [email, activeUserId]
  )
  return result.rows[0]
}

export async function updateContact(
  oldEmail: string,
  newPhoneNumber: string,
  newEmail: string,
  activeUserId: string
) {
  const result = await pool.query<Contact>(
    `UPDATE contacts 
     SET phoneNumber=$2, email=$3
     WHERE email=$1 AND userRef=$4
     RETURNING *`,
    [oldEmail, newPhoneNumber, newEmail, activeUserId]
  )
  return result.rows[0]
}
