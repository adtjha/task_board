const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://zsaqjgck:P3J6ycRIB9aPBotrNdUTXNWxfenPprX1@cornelius.db.elephantsql.com/zsaqjgck')

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

const Users = sequelize.define('Users', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    user_name: {
        type: DataTypes.STRING,
    },
    user_pwd: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: "Users"
});

sequelize.sync().then(() => {
    console.log('Users table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

exports.Users = Users;

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
