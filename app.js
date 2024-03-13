const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet  = require('helmet')
const hpp = require('hpp')
const rateLimiter = require('express-rate-limit')
const  router  = require('./src/routes/api')

require('dotenv').config()
const app = new express()

//open  cors 
app.use(cors())

//security implement

app.use(helmet())
app.use(hpp())
app.use(express.json({limit:'25MB'}))
app.use(express.urlencoded({extended:true}))
const limiter = rateLimiter({windowMs:15*60*1000,max:3000})
app.use(limiter)

//mongoose database implement
const URL = `${process.env.DB_NAME}`
const OPTION = {name:'' , pass:'', autoIndex:true}
mongoose.connect(URL,OPTION).then((res)=>{
    console.log('Database Connected Suucessfully...!')
}).catch((err)=>{
    console.log(err)
})



app.use('/api', router)


app.use('*',(req,res)=>{
    res.status(404).json({status:'Fail' , message:'404 Not Found'})
})

module.exports = app