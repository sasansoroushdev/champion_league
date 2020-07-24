const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const MatchAndResult = require('../models/MatchAndResult');
const GroupAndResult = require('../models/GroupAndResult');
const Team = require('../models/Team');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

// @desc      Get MatchAndResult
// @route     GET /api/v1/matchandresult/:groupName
// @access    Public
exports.getMatchAndResults = asyncHandler(async (req, res, next) => {   
    const matchAndResults = MatchAndResult.aggregate([
      {$lookup:{
        from: 'teams',
        localField: 'homeTeam',
        foreignField: '_id',
        as: 'homeTeamDetails'
       },
      },
     {$lookup:{
       from: 'teams',
       localField: 'awayTeam',
       foreignField: '_id',
       as: 'awayTeamDetails'
      },
     },    
    { $match: { 'group':  req.params.groupName  }}
  ]).then(function (result) {
     res.status(200).json({
       success: true,
       data: result
     });
   });
});


// @desc      Get playMatch
// @route     GET /api/v1/matchandresult/predictandplaymatch/:matchId
// @access    Public
exports.predictAndPlayMatch = asyncHandler(async (req, res, next) => {
    var matchId = req.params.matchId;
    const primaryMatchAndResult = await MatchAndResult.findById(matchId);
    if(primaryMatchAndResult.isOver){
      return res.status(400).json({
        success: false,
        status: 'match is over',
        data: primaryMatchAndResult
      }); 
    }

    await predictAndSaveMatchResult(primaryMatchAndResult.homeTeam,primaryMatchAndResult.awayTeam,matchId);
    const matchAndResult = await MatchAndResult.findById(matchId);
    return res.status(200).json({
      success: true,
      data: matchAndResult
    }); 
});


async function predictAndSaveMatchResult(homeTeam, awayTeam, match){
  var homeTeamIndexes = await Team.findById(homeTeam);
  var awayTeamIndexes = await Team.findById(awayTeam);

  var homeTeamOffence = parseFloat( homeTeamIndexes.offence);
  var homeTeamDefence = parseFloat(homeTeamIndexes.defence);
  var awayTeamOffence = parseFloat(awayTeamIndexes.offence);
  var awayTeamDefence = parseFloat(awayTeamIndexes.defence);

  var powerIndexesChallengeForHomeTeamGoals = (homeTeamOffence + awayTeamDefence)/2 ;
  var powerIndexesChallengeForAwayTeamGoals = (homeTeamDefence + awayTeamOffence)/2 ;

  var randomAccidentPercentForHomeTeamGoals = 
  (Math.floor(Math.random() * 
   process.env.POSITIVE_ACCIDENT_INFLUENCE_PERCENT
  +process.env.NEGATIVE_ACCIDENT_INFLUENCE_PERCENT+1) 
  -process.env.NEGATIVE_ACCIDENT_INFLUENCE_PERCENT)/100; // default is -10 to 10 percent accident for home team 

  var randomAccidentPercentForAwayTeamGoals = 
  (Math.floor(Math.random() * 
  process.env.POSITIVE_ACCIDENT_INFLUENCE_PERCENT
  +process.env.NEGATIVE_ACCIDENT_INFLUENCE_PERCENT+1) 
  -process.env.NEGATIVE_ACCIDENT_INFLUENCE_PERCENT)/100; // default is -10 to 10 percent accident for away team 

  var homeInfuenceForHomeTeamGoals =  
  (Math.floor(Math.random() * process.env.POSITIVE_HOST_INFLUENCE_PERCENT))/100; // default is 10 percent host influence for home team
  var awayInfuenceForAwayTeamGoals =  
  -1*(Math.floor(Math.random() * process.env.NEGATIVE_HOST_INFLUENCE_PERCENT) )/100; // default is -10 percent influence for away team
  
  var homeTeamGoals = powerIndexesChallengeForHomeTeamGoals 
  + powerIndexesChallengeForHomeTeamGoals*randomAccidentPercentForHomeTeamGoals
  + powerIndexesChallengeForHomeTeamGoals*homeInfuenceForHomeTeamGoals;
  
  var awayTeamGoals = powerIndexesChallengeForAwayTeamGoals 
  + powerIndexesChallengeForAwayTeamGoals*randomAccidentPercentForAwayTeamGoals
  + powerIndexesChallengeForAwayTeamGoals*awayInfuenceForAwayTeamGoals;


  homeTeamGoals = Math.round(homeTeamGoals);
  awayTeamGoals = Math.round(awayTeamGoals);

  const matchAndResult = await MatchAndResult.findById(match);
  await matchAndResult.update({isOver: true, homeTeamGoals: homeTeamGoals, awayTeamGoals: awayTeamGoals});
  
  const groupAndResultForHomeTeam = await GroupAndResult.findOne({team: homeTeam});
  const groupAndResultForAwayTeam = await GroupAndResult.findOne({team: awayTeam});

  if(homeTeamGoals - awayTeamGoals>0){

    await groupAndResultForHomeTeam.update(
      {
        matchPlayed: groupAndResultForHomeTeam.matchPlayed + 1,
        win: groupAndResultForHomeTeam.win + 1,
        goalsFor: groupAndResultForHomeTeam.goalsFor + homeTeamGoals,
        goalsAgainst: groupAndResultForHomeTeam.goalsAgainst + awayTeamGoals,
        points: groupAndResultForHomeTeam.points + 3
      }

    );

    await groupAndResultForAwayTeam.update(
      {
        matchPlayed: groupAndResultForAwayTeam.matchPlayed + 1,
        lose: groupAndResultForAwayTeam.lose + 1,
        goalsFor: groupAndResultForAwayTeam.goalsFor + awayTeamGoals,
        goalsAgainst: groupAndResultForAwayTeam.goalsAgainst + homeTeamGoals,
      }
    );    
    }
  if(homeTeamGoals - awayTeamGoals<0){
    await groupAndResultForHomeTeam.update(
      {
        matchPlayed: groupAndResultForHomeTeam.matchPlayed + 1,
        lose: groupAndResultForHomeTeam.lose + 1,
        goalsFor: groupAndResultForHomeTeam.goalsFor + homeTeamGoals,
        goalsAgainst: groupAndResultForHomeTeam.goalsAgainst + awayTeamGoals,
      }

    );

    await groupAndResultForAwayTeam.update(
      {
        matchPlayed: groupAndResultForAwayTeam.matchPlayed + 1,
        win: groupAndResultForAwayTeam.win + 1,
        goalsFor: groupAndResultForAwayTeam.goalsFor + awayTeamGoals,
        goalsAgainst: groupAndResultForAwayTeam.goalsAgainst + homeTeamGoals,
        points: groupAndResultForAwayTeam.points + 3

      }
    );
    
  }

  if(homeTeamGoals - awayTeamGoals==0){
    await groupAndResultForHomeTeam.update(
      {
        matchPlayed: groupAndResultForHomeTeam.matchPlayed + 1,
        draw: groupAndResultForHomeTeam.draw + 1,
        goalsFor: groupAndResultForHomeTeam.goalsFor + homeTeamGoals,
        goalsAgainst: groupAndResultForHomeTeam.goalsAgainst + awayTeamGoals,
        points: groupAndResultForAwayTeam.points + 1

      }

    );

    await groupAndResultForAwayTeam.update(
      {
        matchPlayed: groupAndResultForAwayTeam.matchPlayed + 1,
        draw: groupAndResultForAwayTeam.draw + 1,
        goalsFor: groupAndResultForAwayTeam.goalsFor + awayTeamGoals,
        goalsAgainst: groupAndResultForAwayTeam.goalsAgainst + homeTeamGoals,
        points: groupAndResultForAwayTeam.points + 1

      });
  }
}
