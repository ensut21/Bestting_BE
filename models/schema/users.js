module.exports = (sequelize, Sequelize) => {
    const schema = sequelize.define(
        'users',
        {
            user_id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            firstname: {
                type: Sequelize.STRING
            },
            lastname: {
                type: Sequelize.STRING
            },
            authorization: {
                type: Sequelize.JSONB,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
            },
            terminated_at: {
                type: Sequelize.DATE,
                defaultValue: null,
            }
        },
        {
            freezeTableName: true,
        },
    );
    return schema;
};