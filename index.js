require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./DB/db')
const userroutes =require('./Routes/userroutes')

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

app.use(cors())

connectDB(DATABASE_URL)

app.use(express.json())

app.use('/user',userroutes)


app.listen(port,()=>{
    console.log(`Server listened at http://localhost:${port}`)
})