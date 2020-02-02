'use strict';

var properties = require('../package.json')
var querystring = require("querystring");
var conn = require('../db/dbconnection.js')

//var querystring = require("querystring");

//var pg = require('pg');
//var conString = "postgres://corina:corina123@localhost:5432/corina";

//var client = new pg.Client(conString);

var controllers = {
   about: function(req, res) {
    console.log(req);
       var aboutInfo = {
           name: properties.name,
           version: properties.version
       }
       res.json(aboutInfo);
   },
   getDistance: function(req, res) {
        distance.find(req, res, function(err, dist) {
               if (err)
                   res.send(err);
               res.json(dist);
           });
    },
    addUser: function(req, res) {
        console.log("aaaaa");
        console.log(req.body);
        //console.log(req
        var body = req.body;
        //var user = data.email;
        var email = req.body['email'];
        var pwd = req.body['password'];

        var name = req.body['name'];
        var surname = req.body['surname'];
        var is_admin = req.body['is_admin'];

        console.log(body);
       
        console.log(email);
        console.log("aaaa"+pwd);

        const res_data = JSON.parse(JSON.stringify(body));
        
        //client.connect()
        conn.add(email, pwd, name, surname,is_admin, function(error, response){
            console.log(error);
            if(error){
                res.json({
                    success: false,
                    message: 'Insert into requests unsuccessful!'
                });
            }else{
                res.json({
                    success: true,
                    message: 'Added with SUCCESS!!'
                });
                
            }
        });
       // console.log("added");
        //console.log(added);
        
        /*client.query("INSERT INTO users (email, password, name, surname, is_admin) VALUES ('"+email+"', '"+pwd+"', '"+name+"', '"+surname+"', "+is_admin+");",
          (err, res) => {
            console.log(err, res);
            client.end();
         }
        );*/
        
    },
};

module.exports = controllers;
