const asyncHandler = require('express-async-handler')

const protect = asyncHandler( async (req, res, next) => {

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            req.userid = token
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
                
    }
    if(!token){
        res.status(401)
        throw new Error('No Token, Not Authorized!...')
    }
})

module.exports = { protect }