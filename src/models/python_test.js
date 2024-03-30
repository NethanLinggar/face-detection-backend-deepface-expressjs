const dbPool = require('../config/database');

const runPython = () => {
    const SQLQuery = 'SELECT * FROM users';

    return dbPool.execute(SQLQuery);
}

module.exports = {
    runPython
}