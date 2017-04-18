process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'

import Route from './routes'
import { config } from './mongo.config'
import dbConnect from './mongoose'

const Mongoose = dbConnect(config.database)
const app = express()
const port = Number(process.env.PORT || 8080)

const route = new Route(app)

app.set('superSecret', config.secret); // secret variable

if(process.env.NODE_ENV == 'developemnt')
	app.use(morgan('dev')); // Development will have logs
else
	app.use(compression()); // Production will compress file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
route.userRoute()

app.listen(port,() => {
	console.log(`Listening at ${port}`)
});

