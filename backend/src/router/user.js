import express from 'express'
import User from '../model/userModel.js'
import auth from '../middleware/auth.js'

const router = express.Router()

/*
POST    "/user"         Create user
PUT     "/user"         Update user     
DELETE  "/user"         Delete user     

POST    "/user/login"   Request jwt
POST    "/user/logout"  Invalidate jwt
*/

// generate a user from the requestBody,
// then generate a JWT, 
// finally send created user and JWT
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateJWT()
        res.send({user, token})
    } catch (err) {
        res.status(400).send(err)
    }
})

// Update the User
router.put('/user', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedFields = ['name', 'password']
    const allAllowed = updates.every( e => allowedFields.includes(e))

    if(!allAllowed) 
        return res.status(400).send({error:'Invalid updates!'})

    try{
        updates.forEach( prop => req.user[prop] = req.body[prop])
        await req.user.save()

        res.status(200).end()
    } catch(err){
        res.status(500).end()
    }
})

// Delete the User (cascading deletion!)
router.delete('/user', auth, async (req, res) => {
    try{
        await req.user.remove()

        res.status(200).end()
    } catch(err){
        res.status(500).end()
    }
})

// find a user based on password and name, 
// then send a new JWT
router.post('/user/login', async (req, res) => {
    const name = req.body.name
    const password = req.body.password
    try {
        const user = await User.findByNameAndPassword(name, password)
        const token = await user.generateJWT()
        res.send({token})
    } catch (err) {
        res.status(400).send(err)
    }
})

// logout by filtering the currently used token out of the tokens list in user
router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter( (token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).end()
    } catch(err){
        console.log(err)
        res.status(500).end()
    }
})

// logout by saving the user with an empty tokens list
router.post('/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).end()
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
})

export default router