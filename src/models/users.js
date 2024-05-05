const dbPool = require('../config/database');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM users';

    return dbPool.execute(SQLQuery);
}

const getUser = (idUser) => {
    const SQLQuery = `SELECT * FROM users WHERE nrp=${idUser}`;

    return dbPool.execute(SQLQuery);
}

const getUserEmbedding = (idUser) => {
    const SQLQuery = `SELECT embedding FROM users WHERE nrp=${idUser}`;

    return dbPool.execute(SQLQuery);
}

const createNewUser = (body) => {
    const SQLQuery = `INSERT INTO users (nrp, name, embedding) VALUES (?, ?, ?)`;
    const values = [body.nrp, body.name, body.embedding];

    // return dbPool.execute(SQLQuery, values);
    return body.embedding
}

const updateUser = (body, idUser) => {
    const SQLQuery = `  UPDATE users 
                        SET name='${body.name}'
                        WHERE nrp='${idUser}'`;

    return dbPool.execute(SQLQuery);
}

const deleteUser = (idUser) => {
    const SQLQuery = `DELETE FROM users WHERE nrp=${idUser}`;

    return dbPool.execute(SQLQuery);
}

module.exports = {
    getAllUsers,
    getUser,
    getUserEmbedding,
    createNewUser,
    updateUser,
    deleteUser,
}