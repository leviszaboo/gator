import pool from "../db/connect";
import { BlackList } from "../models/blacklist.model";

export async function checkBlackListedToken(token: string) {
  try {
    const [blackListedToken] = await pool.query<BlackList[]>(
      `SELECT * FROM blacklist WHERE token = ?`,
      [token]
    );

    return blackListedToken[0];
  } catch (err: any) {
    throw err;
  }
}

export async function blackListToken(token: string) {
  if (await checkBlackListedToken(token)) {
    return;
  }

  try {
    await pool.query(`INSERT INTO blacklist (token) VALUES (?)`, [token]);
  } catch (err: any) {
    throw err;
  }
}
