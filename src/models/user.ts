import { pool } from "../db/connect.js"

export type User = {
  id: string
  username: string
  firstname: string
  lastname: string
  homeaddress: string
}

export async function createUser(
  username: string,
  firstname: string,
  lastname: string,
  homeaddress: string
) {
  const result = await pool.query<User>(
    `INSERT INTO users ( username, firstname,lastname, homeaddress) VALUES ($1, $2, $3, $4) RETURNING *`,
    [username, firstname, lastname, homeaddress]
  )
  return result.rows[0]
}

export async function listUsers() {
  const result = await pool.query<User>(`SELECT * FROM users`)
  return result.rows
}

export async function updateUser(
  username: string,
  homeaddress: string,
  firstname: string,
  lastname: string
) {
  const result = await pool.query<User>(
    `UPDATE users SET homeaddress=$2, firstname=$3, lastname=$4 WHERE username=$1 RETURNING *`,
    [username, homeaddress, firstname, lastname]
  )
  return result.rows[0]
}

export async function deleteUser(username: string) {
  await pool.query(`DELETE FROM users WHERE username=$1`, [username])
}
