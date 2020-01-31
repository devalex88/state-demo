const express = require('express')
const findAllPaths = require('./paths')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', function(req, res) {
    const paths = findAllPaths()
    res.render('pages/index', { paths })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))