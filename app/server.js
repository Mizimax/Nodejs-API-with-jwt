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
const port = Number(process.env.PORT || 8000)

const route = new Route(app)

app.set('superSecret', config.secret); // secret variable

if(process.env.NODE_ENV == 'development')
	app.use(morgan('dev')); // Development will have request logs
else
	app.use(compression()); // Production will compress file

/* SUPPORT TYPE */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

/* CORS */
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/* ROUTE */
app.get('/', (req, res)=>{
    res.json({message: 'Example of RESTful api + jwt'})
})
route.userRoute()
route.blogRoute()

app.listen(port,() => {
	console.log(`Listening at ${port}`)
});

