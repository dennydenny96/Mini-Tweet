const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')

app.use(express.urlencoded({extended: false}))

app.set('view engine', 'ejs')
app.use('/', routes)


app.listen(port, () => console.log(`active listening on port ${port}`))