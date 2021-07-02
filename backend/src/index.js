import mongoose from 'mongoose'
import express from 'express'

import listRouter from './router/list.js'
import userRouter from './router/user.js'
import cors from './middleware/cors.js'

mongoose.connect('mongodb://localhost:27017/watchlist',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const app = express()
app.use(cors)
app.use(express.json())

app.use(listRouter)
app.use(userRouter)
app.listen(3000, () => {
    console.log('Server started on port 3000.')
})
