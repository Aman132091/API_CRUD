const mongoose = require('mongoose')
const detailsToUpdate = new mongoose.Schema({
    oldUsername:{
        type:String,
    },
    newUsername:{
        type:String,
    },
    oldEmail:{
        type:String
    },
    newEmail:{
        type:String
    },
    oldPassword:{
        type:String
    },
    newPassword:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }

})

const updateUsername = mongoose.model('user_Update',detailsToUpdate)
module.exports = updateUsername