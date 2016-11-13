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

let getPopularImage = (req, done) => {
    let org = req.org;
    let url = "https://hub.docker.com/v2/repositories/"+org+"/";
    let biggest = {pull_count: 0};

    let spider = (url)=> {
        request.get({"json": true, url}, (err,res,body) => {
            if(!err) {
                body.results.forEach((repo)=> {
                    if(repo.pull_count > biggest.pull_count) {
                        biggest = repo;
                    }
                });
                if(body.next) {
                    spider(body.next)
                } else {
                    return done(err, biggest);
                }
            }
        });
    };
    spider(url);
}

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
    countCaptains: countCaptains,
    getPopularImage: getPopularImage
}

//getStats({org:"alexellis2", "repoName":"cows"}, (err,val)=> {console.log(val)});
//countCaptains((err,val) => {console.log(val)});
getPopularImage({org:"alexellis2"},(err,val)=>{console.log(err,val)})