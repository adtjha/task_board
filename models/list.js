const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

const List = sequelize.define('List', {
    id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: "List"
});

// `sequelize.define` also returns the model
console.log(List === sequelize.models.List); // true
