const express = require('express')
const router = express.Router()

function routes(){
    router.get('/',(req,res)=>{
        res.end('it works great!!!')
    })

    return router
}


module.exports = routes