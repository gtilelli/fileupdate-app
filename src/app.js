// The Fileupdate app uses the Express framework to implement its API

const express = require('express')
const cardRouter = require('./routers/card')

const app = express()

app.use( express.json() )
app.use( cardRouter )

module.exports = app