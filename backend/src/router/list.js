import express from 'express'
import Series from '../model/seriesModel.js'
import auth from '../middleware/auth.js'

const router = express.Router()
/*
POST    "/series"       create new series   C
GET     "/series"       return full list    R
GET     "/series/:id"   return series       R
PUT     "/series/:id"   update series       U
DELETE  "/series/:id"   delete series       D
*/

router.post('/series/', auth, async (req, res) => {
    const series = new Series(req.body)
    series.owner = req.user

    try{
        await series.save()
    res.status(200).send(series)
    } catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})

router.get('/series/', auth, async (req, res) => {
    try {
        const list = await Series.find({owner: req.user.id})
        res.send(list)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/series/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const series = await Series.find({_id, owner: req.user.id})
        res.send(series)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.put('/series/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedFields = ['title', 'type', 'episodeLink', 'episodeNr', 'episodeTotal', 'preview', 'startedAiring', 'completed']
    const allAllowed = updates.every( e=>allowedFields.includes(e))

    if(!allAllowed){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try {
        const series = await Series.findOne({_id: req.params.id, owner: req.user._id})

        if(!series){
            return res.status(404).end()
        }

        updates.forEach( prop => series[prop] = req.body[prop])
        await series.save()
        console.log(series)
        console.log(req.body)
        res.status(200).send(series)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/series/:id', auth, async (req, res) => {
    try {
        const series = await Series.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!series){
            res.status(404).end()
        }
        res.status(200).end()
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router