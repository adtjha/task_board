const { Sequelize } = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    list_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: "Task"
});

// `sequelize.define` also returns the model
console.log(Task === sequelize.models.Task); // true
