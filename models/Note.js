const mongoose = require('mongoose');
const validator = require('validator');

const NoteSchema = mongoose.Schema({
    creationDate: {
    type: Date,
    default: Date.now,
  },
    fio: {
       type: String,
    required: true,
    },
    phone: {
        type: String,
        validate: {
            validator: validator.isNumeric,
            message: 'Invalid phone'
        }, 
        required: true
    },
    problem: {
        type: String,
        required: true
    }
})

const Note = mongoose.model('Note', NoteSchema)

module.exports = Note
