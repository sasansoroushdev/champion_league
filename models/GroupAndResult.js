const mongoose = require('mongoose');

const GroupsAndResultSchema = new mongoose.Schema({

 groupName: {
    type: String,
    required: [true, 'Please add group name']
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  matchPlayed: {
      type: Number,
      default: 0

  }, 
  win:{
    type: Number,
    default: 0

  },
  lose:{
    type: Number,
    default: 0

  },
  draw:{
    type: Number,
    default: 0

  },
  goalsFor:{
    type: Number,
    default: 0

  },
  goalsAgainst:{
    type: Number,
    default: 0

  },
  goalsDifference:{
    type: Number,
    default: 0

  },
  points:{
    type: Number,
    default: 0

  } 
  
});

module.exports = mongoose.model('GroupsAndResult', GroupsAndResultSchema);