import { pool } from '../db/connect.js'

export type User = {
  id: string
  username: string
  firstname: string
  lastname: string
  homeaddress: string
  description: string
  owes_me: string
}

export async function createUser(
  username: string,
  firstname: string,
  lastname: string,
  homeaddress: string,
  description: string,
  owes_me: string
) {
  
  const result = await pool.query<User>(
    `INSERT INTO users ( username, firstname,lastname, homeaddress,description,owes_me) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *`,
    [username, firstname, lastname, homeaddress, description, owes_me]
  )
  return result.rows[0]
}

export async function listUsers() {
  const result = await pool.query<User>(`SELECT * FROM users`)
  return result.rows
}

export async function getUserByUsername(username: string) {
  const result = await pool.query<User>(
    `SELECT * FROM users WHERE username = $1 LIMIT 1`,
    [username]
  )
  return result.rows[0]
}

export async function updateUser(
  username: string,
  homeaddress: string,
  firstname: string,
  lastname: string,
  description?: string,
  owes_me?: string | number
) {

  const result = await pool.query<User>(
    `UPDATE users
     SET homeaddress = $2,
         firstname = $3,
         lastname = $4,
         description = COALESCE($5, description),
         owes_me = COALESCE($6, owes_me)
     WHERE username = $1
     RETURNING *`,
    [username, homeaddress, firstname, lastname, description, owes_me]
  )
  return result.rows[0]
}

export async function deleteUser(username: string) {
  await pool.query(`DELETE FROM users WHERE username=$1`, [username])
}
