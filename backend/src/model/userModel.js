import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import secret from '../../config/secrets.js'
import Series from './seriesModel.js'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        minlength: [3, "Name must be at least 3 characters long!"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, "password must be at least 8 characters long!"]
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// dont store passwords as plain-text
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// find user by name then compare passwords
userSchema.statics.findByNameAndPassword = async (name, password) => {
    const user = await User.findOne({name})
    if(!user){
        throw new Error('Wrong Name or Password!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Wrong Name or Password!')
    }

    return user;
}

// generate a token
userSchema.methods.generateJWT = async function(){
    const user = this
    const token = jwt.sign({_id: user.id.toString()}, secret)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// overwrite mongoose method (hide some fields)
userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

// connect Series and User 
userSchema.virtual('series', {
    ref:'Series',
    localField: '_id',
    foreignField: 'owner'
})

// cascading deletion
userSchema.pre('remove', async function(next){
    const user = this
    await Series.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)
export default User