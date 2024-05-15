module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        nrp: {
            allowNull: false,
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
    });
    return User;
}