module.exports = (res,statusCode,data)=>{
    res.status(statusCode).json({
        status:'success',
        data
    })
}