const bcrypt = require('bcryptjs')
const db = require('../config/connectDB');
const cartService = require('./cartService');

let usernameExists = async (username) => {
    const result = await db.query('select USERNAME from user where USERNAME = ? limit 1', [username]);
    return result[0].length > 0;
};
let emailExists = async (email) => {
    const result = await db.query('select EMAIL from user where EMAIL = ? limit 1', [email]);
    return result[0].length > 0;
};
let getUserByUsername = async (username) => {
    const result = await db.query('select * from user where USERNAME = ? limit 1', [username]);
    return result[0][0];
};

//Check info input logging
let checkUserCredential = async (username, password) => {
    const user = await getUserByUsername(username);
    //console.log('user: ', user)
    if (!user) return null;
    if (await bcrypt.compare(password, user.PASSWORD))
        return user;

    return null;
}
let insertUser = async (username, email, hash) => {
    await db.query("INSERT INTO user (USERNAME, ADMIN, EMAIL, PASSWORD) VALUES (?,'0', ?, ?)", [username, email, hash]);
    //console.log(username);
}
let register = async (username, email, password) => {
    //console.log(username, email, password)
    if (await usernameExists(username))
        return 'Username đã tồn tại';
    if (await emailExists(email))
        return 'Email đã tồn tại';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await insertUser(username, email, hash);
    const user = await checkUserCredential(username, password);
    const res = await cartService.addCartUser(user.IDUSER);
    return user;
}
let getUserByID = async (id) => {
    const result = await db.query('select * from user where IDUSER = ? limit 1', [id]);
    return result[0][0];
};
let getIDUserByEmail = async (email) => {
    const result = await db.query('select IDUSER from user where EMAIL = ? limit 1', [email]);
    return result[0][0];
}


module.exports = {
    usernameExists,
    getUserByUsername,
    checkUserCredential,
    register,
    emailExists,
    getUserByID,
    getIDUserByEmail
}