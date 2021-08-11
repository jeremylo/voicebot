import { query } from '../db.js';


export async function findUserById(id) {
    return (await query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

export async function findUnactivatedUserByReferenceId(refId) {
    return (await query("SELECT * FROM users WHERE reference_id=? AND status=? LIMIT 1", [refId, 0]))[0];
}

export async function findUserByEmail(email) {
    return (await query("SELECT * FROM users WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

export async function activateUser(id, referenceId, email, password) {
    return (await query("UPDATE users SET email=?, password=?, status=? WHERE id=? AND reference_id=?", [email, password, 1, id, referenceId]));
}

export async function updateUserEmail(user, email) {
    return (await query("UPDATE users SET email=? WHERE id=?", [email, user.id]));
}

export async function updateUserPassword(user, password) {
    return (await query("UPDATE users SET password=? WHERE id=?", [password, user.id]));
}

export async function updateUserOutwardPostcode(user, outwardPostcode) {
    return (await query("UPDATE users SET outward_postcode=? WHERE id=?", [outwardPostcode, user.id]));
}

export async function updateUserSharing(user, sharing) {
    return (await query("UPDATE users SET sharing=? WHERE id=?", [sharing ? 1 : 0, user.id]));
}
