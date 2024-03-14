const express = require('express');//1
const morgan = require('morgan');
const cors = require('cors');//2

const authRoute = require('./routes/auth.route');

//const { httpLogStream } = require('./utils/logger');

const app = express();//3


app.use(express.json());// 4 input/output
//app.use(express.urlencoded({ extended: false }));
//app.use(morgan('dev'));
//app.use(morgan('combined', { stream: httpLogStream }));
app.use(cors());// cors 




app.use('/api/auth', authRoute);
http://localhost:3000/
app.get('/', (req, res) => {
    // req -> 
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;