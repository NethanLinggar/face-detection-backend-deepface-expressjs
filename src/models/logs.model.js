module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define('log', {
        userNrp: {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'nrp',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    });

    Log.associate = (models) => {
        Log.belongsTo(models.users, { foreignKey: 'userNrp' });
    };

    return Log;
}