import jwt from 'jsonwebtoken'
import secret from '../../config/secrets.js'
import User from '../model/userModel.js'

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, secret)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.user = user
        req.token = token

        next()
    } catch (err){
        res.status(401).send({error: 'Please Authenticate!'})
    }
}

export default auth