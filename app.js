const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    if(req.header === "" && req.params === ""){
        res.send("No header or params are sent it")
    }
    else {
        res.send({param: req.header, param:req.params,env:process.env.UNIQUE_KEY})
    }
}
)
app.post('/', (req, res) => res.send('Hello World!'))
app.put('/', (req, res) => res.send('Hello World!'))
app.delete('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`HW2 app listening on port ${port}!`))