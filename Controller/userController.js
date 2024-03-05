require('dotenv').config()
const userModel = require('../Models/user')
const detailsToUpdate =require('../Models/updateAllDetails')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const signup = async(req,res)=>{
    const {username,email,password} = req.body
    
    const user = await userModel.findOne({email})
    if(user){
        res.send({"status":"failed","message":"Email Already Exists"})
    }else{
        if(username && email && password){
            try {
                const salt = await bcryptjs.genSalt(10)
                const hashPassword = await bcryptjs.hash(password,salt)
                const newUser = new userModel({
                    username:username,
                    email:email,
                    password:hashPassword
                })
                await newUser.save()

                const savedUser = await userModel.findOne({email})
                
                const token = jwt.sign({userID:savedUser._id},process.env.SECRET_KEY,{expiresIn:'5d'})

                res.status(201).send({"status":"success","message":"SignUp Successfully","token":token})
            } catch (error) {
                console.log('ERROR: ',error);
                res.send({"status":"failed","message":"New User Not Created"})
                
            }
        }else{
            res.send({"status":"failed","message":"All fields Required"})
        }
    }
}

const signin = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(email&&password){
            const user = await userModel.findOne({email})
            if(user){
                const matchPassword = await bcryptjs.compare(password,user.password)
                if((user.email === email) && matchPassword){
                    
                    const token = jwt.sign({userID:user._id},process.env.SECRET_KEY,{expiresIn:'5d'})
                    res.send({"status":"success","message":"SignIn Successfully","token":token})
                }else{
                    res.send({"status":"failed","message":"Email or Password Not MAtched"})
                }
            }else{
                res.send({"status":"failed","message":"Please Provide Correct Information"})
            }
        }else{
            res.send({"status":"failed","message":"All fields Required"})
        }
        
    } catch (error) {
        console.log('Error in login: ',error);
        res.send({"status":"failed","message":"Not Abled To SignIn"})
        
    }
    

}

const readUser = async(req,res)=>{
    res.send({"user":req.user})

}


const updateUsername = async(req,res)=>{
    try {
        const dataNeed = new detailsToUpdate ({
            oldUsername:req.body.oldUsername,
            newUsername:req.body.newUsername
        }) 

        const match = await userModel.findOne({username:dataNeed.oldUsername})
        if(!match){
            res.send({"status":"failed","message":"Doesn't matched"})
        }else{
            await userModel.updateOne({username:dataNeed.oldUsername},{$set:{username:dataNeed.newUsername}})
        }
        
        res.send({"status":"success","message":"Username Updated Successfully"})

        
    } catch (error) {
        res.send({"status":"failed","message":"All fields Required"})
        
    }
}

const updateEmail = async(req,res)=>{
    try {
        const emailNeed = new detailsToUpdate({
            oldEmail:req.body.oldEmail,
            newEmail:req.body.newEmail
        })
        const matchEmail = await userModel.findOne({email:emailNeed.oldEmail})
        if(!matchEmail){
            res.send({"status":"failed","message":"Doesn't Matched"})
        }else{
            await userModel.updateOne({email:emailNeed.oldEmail},{$set:{email:emailNeed.newEmail}})
            res.send({"status":"success","message":"Email Updated"})
        }
        
    } 
    catch (error) {
        res.send({"status":"failed","message":"All field Required"})
        
    }
}


const updatePassword = async (req, res) => {
    try {
        const passwordToUpdate = new detailsToUpdate({
            _id : req.body._id ,
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword
        });

        const user = await userModel.findOne({ _id:passwordToUpdate._id});

        if (!user) {
             res.send({ "status": "failed", "message": "User not found" });
        }

        const matchPassword = await bcryptjs.compare(passwordToUpdate.oldPassword, user.password);

        if (!matchPassword) {
             res.send({ "status": "failed", "message": "Password not matched" });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedNewPassword = await bcryptjs.hash(passwordToUpdate.newPassword, salt);

        // Update the password in the database
        await userModel.updateOne({ _id: user._id }, { $set: { password: hashedNewPassword } });

         res.send({ "status": 'success', "message": "Password Updated Successfully" });

    } catch (error) {
         res.send({ "status": "failed", "message": "All fields required" });
    }
}

const deleteUser = async(req,res)=>{
    try {
        // const {email,password} = req.body
        const emailNeed = new detailsToUpdate ({
            email:req.body.email,
            password:req.body.password
        })
        const match = await userModel.findOne({email:emailNeed.email})
        if(!match){
            res.send('Email or Password required')
        }else{
            await userModel.deleteOne({email:emailNeed.email})
            res.send('user deleted successfully')
        }
    } catch (error) {
        res.send('delete user not working')
        
    }
}


module.exports = {signup,signin,readUser,updateUsername,updateEmail,updatePassword,deleteUser}