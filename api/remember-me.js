import pool from './db.js';

export async function findRememberMeToken(token) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("SELECT * FROM remember_me WHERE token=? LIMIT 1", [token, 1]))[0];
    } catch (e) {
        throw new Error("Unable to retrieve this token.");
    } finally {
        conn.release();
    }
}
