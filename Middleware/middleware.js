const jwt = require('jsonwebtoken')
const userModel = require('../Models/user')

const checkAuth = async(req,res,next)=>{
    let token 
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1]

            const {userID} = jwt.verify(token,process.env.SECRET_KEY)

            req.user = await userModel.findById(userID).select('-password')
            // console.log(req.user);
            next()
        } catch (error) {
            res.send({"status":"failed","message":"Not able to access"})
            
        }

    }
    if(!token){
        res.send({"status":"failed","message":"Need token to read Data"})
    }
}

module.exports = checkAuth
