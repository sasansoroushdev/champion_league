const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const dotenv = require('dotenv');
const asyncHandler = require('../middleware/async');
const GroupAndResult = require('../models/GroupAndResult');
const MatchAndResult = require('../models/MatchAndResult');
const Team = require('../models/Team');
dotenv.config({ path: '../config/config.env' });



// @desc      Get GroupAndResult
// @route     GET /api/v1/groupandresult/:groupName
// @access    Public
exports.getGroupAndResults = asyncHandler(async (req, res, next) => {   
  const groupAndResult = GroupAndResult.aggregate([
    {$lookup:{
      from: 'teams',
      localField: 'team',
      foreignField: '_id',
      as: 'teamDetails'
     },
    },
      
  { $match: { 'groupName':  req.params.groupName  }}
]).then(function (result) {
   res.status(200).json({
     success: true,
     data: result
   });
 });
});



// @desc      draw and create groups and return
// @route     GET /api/v1/groupandresult/drawandgetgroups
// @access    Private
exports.drawAndCreateGroups = asyncHandler(async (req, res, next) => {
    await drawForGroupAndSaveResults();
    await drawForFirstMatchAndSaveResults();
    const groupAndResult = GroupAndResult.aggregate([
      {$lookup:{
        from: 'teams',
        localField: 'team',
        foreignField: '_id',
        as: 'teams'
    },
  },
    {$unwind:'$teams'},
    {$project:{
      teamName:'$teams.name',          
      teamId:'$teams._id',          
      groupName: 1                
    }}

  ]).then(function (result) {
     res.status(200).json({
       success: true,
       data: result
     });
   });
    
});

async function drawForFirstMatchAndSaveResults(){
  await MatchAndResult.deleteMany({});
  let groupName = 'A';

  for (i = 0; i < 8; i++) {

    let randomSkipTeamArray = [0,1,2,3];

    let randomSkipTeamAndIndex = getRandomAndIndex(randomSkipTeamArray);
    let randomSkip = randomSkipTeamAndIndex[0];
    randomSkipTeamArray.splice(randomSkipTeamAndIndex[1], 1);
    const randomFirstTeam = await GroupAndResult.findOne({groupName: groupName}).sort({'_id': -1}).skip(randomSkip).select('team');

    randomSkipTeamAndIndex = getRandomAndIndex(randomSkipTeamArray);
    randomSkip = randomSkipTeamAndIndex[0];
    randomSkipTeamArray.splice(randomSkipTeamAndIndex[1], 1);
    const randomSecondTeam = await GroupAndResult.findOne({groupName: groupName}).sort({'_id': -1}).skip(randomSkip).select('team');

    randomSkipTeamAndIndex = getRandomAndIndex(randomSkipTeamArray);
    randomSkip = randomSkipTeamAndIndex[0];
    randomSkipTeamArray.splice(randomSkipTeamAndIndex[1], 1);
    const randomThirdTeam = await GroupAndResult.findOne({groupName: groupName}).sort({'_id': -1}).skip(randomSkip).select('team');

    randomSkipTeamAndIndex = getRandomAndIndex(randomSkipTeamArray);
    randomSkip = randomSkipTeamAndIndex[0];
    randomSkipTeamArray.splice(randomSkipTeamAndIndex[1], 1);
    const randomFourthTeam = await GroupAndResult.findOne({groupName: groupName}).sort({'_id': -1}).skip(randomSkip).select('team'); 

    await createMatchAndResult(randomFirstTeam.team, randomSecondTeam.team,randomThirdTeam.team,randomFourthTeam.team,groupName);
    
  nextChar(groupName).then(function(result) {
    groupName = result;
  });
 }
}

async function createMatchAndResult(randomFirstTeam, randomSecondTeam,randomThirdTeam,randomFourthTeam,groupName ){

const match1 = {
   dateTime: new Date(Date.now() + process.env.MATCH1_DATETIME_DELAY * 24 * 60 * 60 * 1000)  // 10 days later
  , homeTeam: randomFirstTeam
  , awayTeam: randomSecondTeam
  ,group: groupName
}
const match2 = {
  dateTime: new Date(Date.now() + process.env.MATCH2_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomFourthTeam
 , awayTeam: randomThirdTeam
 ,group: groupName

}
const match3 = {
  dateTime: new Date(Date.now() + process.env.MATCH3_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomThirdTeam
 , awayTeam: randomFirstTeam
 ,group: groupName

}
const match4 = {
  dateTime: new Date(Date.now() + process.env.MATCH4_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomSecondTeam
 , awayTeam: randomFourthTeam
 ,group: groupName

}
const match5 = {
  dateTime: new Date(Date.now() + process.env.MATCH5_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomFirstTeam
 , awayTeam: randomFourthTeam
 ,group: groupName

}
const match6 = {
  dateTime: new Date(Date.now() + process.env.MATCH6_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomThirdTeam
 , awayTeam: randomSecondTeam
 ,group: groupName

}
const match7 = {
  dateTime: new Date(Date.now() + process.env.MATCH7_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomSecondTeam
 , awayTeam: randomFirstTeam
 ,group: groupName

}
const match8 = {
  dateTime: new Date(Date.now() + process.env.MATCH8_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomThirdTeam
 , awayTeam: randomFourthTeam
 ,group: groupName

}

const match9 = {
  dateTime: new Date(Date.now() + process.env.MATCH9_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomFirstTeam
 , awayTeam: randomThirdTeam
 ,group: groupName

}


const match10 = {
  dateTime: new Date(Date.now() + process.env.MATCH10_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomFourthTeam
 , awayTeam: randomSecondTeam
 ,group: groupName

}


const match11 = {
  dateTime: new Date(Date.now() + process.env.MATCH11_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomFourthTeam
 , awayTeam: randomFirstTeam
 ,group: groupName

}

const match12 = {
  dateTime: new Date(Date.now() + process.env.MATCH12_DATETIME_DELAY * 24 * 60 * 60 * 1000)  
 , homeTeam: randomSecondTeam
 , awayTeam: randomThirdTeam
 ,group: groupName

}

  await MatchAndResult.create([
    match1,match2,match3,match4,match5,match6,match7,match8,match9,match10,match11, match12
  ]);
}

async function drawForGroupAndSaveResults() { 

    await GroupAndResult.deleteMany({});
    await Team.updateMany({selectedForGroupDraw: false});
    let groupName = 'A';
    let randomSkipSeedOneArray = randomSkipSeedTwoArray = randomSkipSeedThreeArray = randomSkipSeedFourArray = [0,1,2,3,4,5,6,7];

    for (i = 0; i < 8; i++) {

    let randomSkipSeedOneAndIndex = getRandomAndIndex(randomSkipSeedOneArray);
    let randomSkipSeedOne = randomSkipSeedOneAndIndex[0];
    randomSkipSeedOneArray.splice(randomSkipSeedOneAndIndex[1], 1);
   
    let randomSkipSeedTwoAndIndex = getRandomAndIndex(randomSkipSeedTwoArray);
    let randomSkipSeedTwo = randomSkipSeedTwoAndIndex[0];
    randomSkipSeedTwoArray.splice(randomSkipSeedTwoAndIndex[1], 1);

    let randomSkipSeedThreeAndIndex = getRandomAndIndex(randomSkipSeedThreeArray);
    let randomSkipSeedThree = randomSkipSeedThreeAndIndex[0];
    randomSkipSeedThreeArray.splice(randomSkipSeedThreeAndIndex[1], 1);

    let randomSkipSeedFourAndIndex = getRandomAndIndex(randomSkipSeedFourArray);
    let randomSkipSeedFour = randomSkipSeedFourAndIndex[0];
    randomSkipSeedFourArray.splice(randomSkipSeedFourAndIndex[1], 1);


    const randomSeedOneTeam = await Team.findOne({seed: 1}).sort({'_id': -1}).skip(randomSkipSeedOne);
    const randomSeedTwoTeam = await Team.findOne({seed: 2}).sort({'_id': -1}).skip(randomSkipSeedTwo);
    const randomSeedThreeTeam = await Team.findOne({seed: 3}).sort({'_id': -1}).skip(randomSkipSeedThree);
    const randomSeedFourTeam = await Team.findOne({seed: 4}).sort({'_id': -1}).skip(randomSkipSeedFour);

    await GroupAndResult.create({
      groupName: groupName, team: randomSeedOneTeam
    });
    await GroupAndResult.create({
      groupName: groupName, team: randomSeedTwoTeam
    });
    await GroupAndResult.create({
      groupName: groupName, team: randomSeedThreeTeam
    });
    await GroupAndResult.create({
      groupName: groupName, team: randomSeedFourTeam
  });

    nextChar(groupName).then(function(result) {
      groupName = result;
  });
  }
}

 async function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

 function getRandomAndIndex(randomSkipArray) {
  let random = randomSkipArray[Math.floor(Math.random() * randomSkipArray.length)];
  let index = randomSkipArray.indexOf(random);
    return [random,index];
}