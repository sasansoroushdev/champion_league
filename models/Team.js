const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add team name']
  },
  seed: {
    type:Number,
    required: [true, 'Please add seed']

  },
  offence: {
    type:  [Number],
    required: [true, 'Please add offence index']

},
defence: {
    type:  [Number],
    required: [true, 'Please add defence index']    
}
});

module.exports = mongoose.model('Team', TeamSchema);