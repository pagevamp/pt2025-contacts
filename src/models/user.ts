import { pool } from "../db/connect.js"

export type User = {
  id: string
  userName: string
  homeAddress: string
}

export async function createUser(
  firstName: string,
  lastName: string,
  homeAddress: string
) {
  const result = await pool.query<User>(
    `INSERT INTO users (firstName,lastName, homeAddress) VALUES ($1, $2, $3) RETURNING *`,
    [firstName, lastName, homeAddress]
  )
  return result.rows[0]
}

export async function listUsers() {
  const result = await pool.query<User>(`SELECT * FROM users`)
  return result.rows
}

export async function updateUser(
  id: string,
  homeAddress: string,
  firstName: string,
  lastName: string
) {
  const result = await pool.query<User>(
    `UPDATE users SET homeAddress=$2, firstName=$3, lastName=$4 WHERE id=$1 RETURNING *`,
    [id, homeAddress, firstName, lastName]
  )
  return result.rows[0]
}

export async function deleteUser(id: string) {
  await pool.query(`DELETE FROM users WHERE id=$1`, [id])
}
