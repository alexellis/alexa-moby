'use strict'

let request = require('request');
let cheerio = require('cheerio');
let Parser = require("./captainsparser");

let countCaptains = (done) => {
    request.get("https://www.docker.com/community/docker-captains", (err, res, text) => {
        let parser = new Parser(cheerio);
        var handles = parser.parse(text);

        done(err, {captainCount: handles.length});
    });
};

let getStats = (req, done) => {
    var ops = {
        json: true,
        uri: "https://hub.docker.com/v2/repositories/" + req.org + "/" + req.repoName 
    };

    request.get(ops, (err, res, body) => {
        let ret = {
            pullCount: 0,
            starCount:0 
        };
        if(!err) {
            ret.pullCount = body.pull_count;
            ret.starCount = body.star_count;
        }

        done(err, ret);
    });
};

module.exports = {
    getStats: getStats,
    countCaptains: countCaptains
}

getStats({org:"alexellisio", "repoName":"nheqminer-cloud"}, (err,val)=> {console.log(val)});
countCaptains((err,val) => {console.log(val)});