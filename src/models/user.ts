import { UserSchema } from './../types/schema.js';
import { pool } from "../db/connect.js"

// export type User = {
//   id: string
//   userName: string
//   homeAddress: string
// }

export async function createUser(firstName: string,lastName: string, homeAddress: string) {
  const result = await pool.query<typeof UserSchema>(
    `INSERT INTO users (firstName,lastName, homeAddress) VALUES ($1, $2, $3) RETURNING *`,
    [firstName, lastName, homeAddress]
  )
  return result.rows
}

export async function listUsers() {
  const result = await pool.query<typeof UserSchema>(`SELECT * FROM users`)
  return result.rows
}

export async function updateUser(
  id: string,
  homeAddress: string,
  firstName: string,
  lastName: string
) {
  const result = await pool.query<typeof UserSchema>(
    `UPDATE users SET homeAddress=$2, firstName=$3, lastName=$4 WHERE id=$1 RETURNING *`,
    [id, homeAddress, firstName, lastName]
  )
  return result.rows
}

export async function deleteUser(id: string) {
  await pool.query(`DELETE FROM users WHERE id=$1`, [id])
}
