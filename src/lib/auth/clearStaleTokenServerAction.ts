"use server"

import { pool } from '@/src/lib/postgres';

export const clearStaleTokens = async () => {
  try{
    // Query to "Delete any verification tokens that have expired"
    const query = {
      text: 'DELETE FROM verification_token WHERE expires < NOW();',
    }
    // Send the SQL command to the DB.
    await pool.query(query);
  } catch(error) {
    throw error;
  }
}