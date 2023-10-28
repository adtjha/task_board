const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors());

const bodyParser = require('body-parser');

const crypto = require('crypto');

app.use(bodyParser.json())

const { Sequelize } = require('sequelize');
const { Users } = require('./models/user');

const sequelize = new Sequelize('postgres://zsaqjgck:P3J6ycRIB9aPBotrNdUTXNWxfenPprX1@cornelius.db.elephantsql.com/zsaqjgck')

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// List API's
app.get('/lists', async (req, res) => {
    const [results, metadata] = await sequelize.query(`SELECT * FROM list;`);
    if (results.length > 0) {
        console.log(results)
        res.send(results);
    } else {
        res.send([])
    }
})

app.post('/list/new', async (req, res) => {
    const list_id = req.body.list_id;
    const list_name = req.body.list_name;
    const [results, metadata] = await sequelize.query(`INSERT INTO list (list_name, list_id) VALUES ('${list_name}', '${list_id}');`);
    console.log(metadata)
    if (metadata === 1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.post('/list/remove', async (req, res) => {
    const list_id = req.body.list_id;
    const [results, metadata] = await sequelize.query(`DELETE FROM List WHERE list_id = ${list_id};`);
    console.log(metadata)
    if (metadata.rowCount === 1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

// Task API's
app.get('/tasks', async (req, res) => {
    const [results, metadata] = await sequelize.query(`SELECT * FROM task;`);
    if (results.length > 0) {
        console.log(results)
        res.send(results);
    } else {
        res.send([])
    }
})

app.post('/task/status', async (req, res) => {
    const task_id = req.body.task_id;
    const task_status = req.body.task_status;
    const [results, metadata] = await sequelize.query(`UPDATE task SET task_status = ${task_status} WHERE task_id = ${task_id};`);
    console.log(metadata)
    if (metadata.rowCount === 1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.post('/task/move', async (req, res) => {
    const task_id = req.body.task_id;
    const list_id = req.body.list_id;
    const [results, metadata] = await sequelize.query(`UPDATE task SET list_id = ${list_id} WHERE task_id = ${task_id};`);
    console.log(metadata)
    if (metadata.rowCount === 1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

// User Auth API's
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    const [results, metadata] = await sequelize.query(`SELECT * FROM Users WHERE Users.user_name = '${username}' LIMIT 1;`);
    console.log({ username, password: hashedPassword, results });
    if (results.length > 0) {
        if (results[0].user_pwd === hashedPassword) {
            const token = jwt.sign({
                username,
                password
            }, 'secret', { expiresIn: 60 * 60 });
            res.send(token);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }
})

app.post('/verify', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err) {
            res.sendStatus(400);
        }
        res.sendStatus(200);
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
