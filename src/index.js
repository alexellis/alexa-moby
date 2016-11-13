"use strict"

var APP_ID = undefined;

var request = require("request");
var intentHandler = require("./intentHandler");
var AlexaSkill = require('./AlexaSkill');
var Moby = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Moby.prototype = Object.create(AlexaSkill.prototype);
Moby.prototype.constructor = Moby;

Moby.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Moby onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Moby.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Moby onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    response.ask("Welcome to the space agency!", "You can say: how many people are in space");
};

Moby.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Moby onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

let org = "alexellis2"; 

Moby.prototype.intentHandlers = {
    // register custom intent handlers
   "MobyCountStarsIntent": function (intent, session, response) {
        let repository = intent.slots.Repository;
        let repoName = repository.value;
        if(!repository || !repoName) {
            response.ask("Ask me about a star count for your repository.", "Ask me about a star count for your repository.")
        } else {
            intentHandler.getStats({org:org,repoName: repoName}, (err, stats) => {
                    var speechOutput = "Your image called "+repoName+" has " + stats.starCount + " stars and it's been pulled " + stats.pullCount+ " times";
                    response.tellWithCard(speechOutput, "Moby's update", speechOutput);
            });
        }
   },
   "MobyCaptainCountIntent": function (intent, session, response) {
        intentHandler.countCaptains((err, stats) =>{
        let speechOutput = "Oh my Captain! There are currently "+stats.captainCount+" Docker Captains.";
            response.tellWithCard(speechOutput, "Moby's update", speechOutput);
        });
   },
   "MobyFindMostPopularIntent": function (intent, session, response) {
        intentHandler.getPopularImage({org:org}, (err, repo) => {
            if(!err) {
                var speechOutput = "Your most popular image is called "+repo.name+" it has been pulled " + repo.pull_count + " times.";
                response.tellWithCard(speechOutput, "Moby's update", speechOutput);
            } else {
                response.ask("I'm sorry I can\'t do that right now", "I'm sorry I can\'t do that right now");
            } 
        });
   },
   "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me how many stars you have!", "You can ask me how many stars you have!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Moby skill.
    var helloWorld = new Moby();
    helloWorld.execute(event, context);
};
