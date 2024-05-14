module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        nrp: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
    });
    return User;
}