import { pool } from "../db/connect.js"
import type { ContactSchema } from "../types/schema.js"

// export type Contact = {
//   id: string
//   phoneNumber: string
//   email: string
//   userId: string
// }

export async function createContact(
  phoneNumber: string,
  email: string,
  activeUserId: string
) {
  const result = await pool.query<typeof ContactSchema>(
    `INSERT INTO contacts (phoneNumber,email, userId) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [phoneNumber, email, activeUserId]
  )
  return result.rows[0]
}

export async function listContacts(activeUserId: string) {
  const result = await pool.query<typeof ContactSchema>(
    `SELECT * FROM contacts WHERE userId=$1`,
    [activeUserId]
  )
  return result.rows
}

export async function deleteContact(email: string, activeUserId: string) {
  const result = await pool.query<typeof ContactSchema>(
    `DELETE FROM contacts 
     WHERE email=$1 AND userId=$2 
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
  const result = await pool.query<typeof ContactSchema>(
    `UPDATE contacts 
     SET phoneNumber=$2, email=$3
     WHERE email=$1 AND userId=$4
     RETURNING *`,
    [oldEmail, newPhoneNumber, newEmail, activeUserId]
  )
  return result.rows[0]
}