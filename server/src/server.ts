import express from "express"
import cors from 'cors'
import routes from './routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json()) // define o tipo de troca de mensagem
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads')))


app.listen(3333)