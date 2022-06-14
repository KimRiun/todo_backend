const Sequelize = require('sequelize');

module.exports = class ToDo extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            todo_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            target_date: {
                type: Sequelize.DATE,
            },
            completed_at: {
                type: Sequelize.DATE,

            },

            is_completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }, 
        }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ToDo',
                tableName: 'todos',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
                timezone: "+09:00",
            
              
        });
    }
    static associate(db) {
        db.Todo.belongsToMany(db.Tag, {through: 'todo_tag'});
    }
};