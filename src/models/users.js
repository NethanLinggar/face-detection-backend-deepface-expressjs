const dbPool = require('../config/database');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM users';

    return dbPool.execute(SQLQuery);
}

const createNewUser = (body) => {
    const SQLQuery = `  INSERT INTO users (nrp, name) 
                        VALUES ('${body.nrp}', '${body.name}')`;

    return dbPool.execute(SQLQuery);
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
    createNewUser,
    updateUser,
    deleteUser,
}