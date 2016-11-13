"use strict"

var request = require('request');
let org = "alexellisio";
let url = "https://hub.docker.com/v2/repositories/"+org+"/";

let spider = (url)=> {
    request.get({"json": true, url}, (err,res,body) => {
        if(!err) {
            body.results.forEach((repo)=>{
                console.log(repo.name)
            });
            if(body.next) {
                spider(body.next)
            }
        } else {
            console.error(err);
        }
    });
};

spider(url);