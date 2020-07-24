const mongoose = require('mongoose');

const MatchesAndResultSchema = new mongoose.Schema({
    
    dateTime: {
        type: Date,
        required: [true, 'Please add match date and time']
    },
    group: {        
        type: String,
        required: true
    },
    homeTeam: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: true
    },
    awayTeam: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: true
    },
    homeTeamGoals: {
        type: Number,
        default: 0
    }, 
    awayTeamGoals: {
        type: Number,
        default: 0
    },
    isOver:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('MatchAndResult', MatchesAndResultSchema);