const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tag_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            tag_created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            font_color: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            bg_color: {
                type: Sequelize.STRING(15),
                allowNull: false,
            }, 
        }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Tag',
                tableName: 'tags',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',

              
        });
    }
    static associate(db) {
        db.Tag.belongsToMany(db.Todo, {through: 'todo_tag'});
    }
};