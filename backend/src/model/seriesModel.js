import mongoose from 'mongoose'
// for mongoose validation see https://mongoosejs.com/docs/validation.html
const Series = mongoose.model('Series', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    episodeLink: {
        type: String,
        required: true,
        trim: true
        // validator: Link (custom regex)
    },
    episodeNr: {
        type: Number,
        default: 1
    },
    episodeTotal: {
        type: Number,
        default: 1
    },
    preview: {
        type: String,
        required: false,
        trim: true
        // validator Link
    },
    startedAiring: {
        type: Date,
        required: false
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
})

export default Series