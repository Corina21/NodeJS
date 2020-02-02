'use strict';

const controller = require('./controller');
const bodyParser = require('body-parser');
const callAPI = require('../service/callAPI.js');
var conn = require('../db/dbconnection.js');
var path = require('path');


var pg = require('pg');
var conString = "postgres://corina:corina123@localhost:5432/corina";

var client = new pg.Client(conString);
client.connect()

let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    
    // For the given username fetch user from DB
    console.log(req.body);
    console.log("aaaaaaaaaaa");
    console.log(email);

    let mockedUsername = 'admin';
    let mockedPassword = 'password';
 
    if (email && password) {
      conn.checkUser(email, password, (err, response) => {
                console.log(err, response);
                if(response.rowCount == 1){
                    let token = jwt.sign({email: email},
                        config.secret,
                        { expiresIn: '24h' // expires in 24 hours
                        }
                      );
                      // return the JWT token for the future API calls
                      res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                    });       
                } else {
                  res.send(403)/*.json({
                    success: false,
                    message: 'Incorrect username or password'
                    
                  });
                  return;*/
                }
                //client.end();
            }
        );
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  profile (req, res) {
    var email = req.body['email'];
    if(req.body['email']){
      conn.selectByEmail(email, (err, response) => {
          console.log(response.rowCount);
          console.log(response.rowCount);
          if(response.rowCount == 1){
              console.log(response);
                //res.json(response.body);       
                res.json(response.rows);       

          } else {
            res.json({
              success: false,
              message: 'User not prezent!!'
              
            });
          }
          //client.end();
      });
    }
    
  }  
  profilesList (req, res) {
    var email = req.body['email'];
    if(req.body['email']){
      conn.selectByEmail(email, (err, response) => {
          console.log("response");
          console.log(response.rows);
          if(response.rowCount == 1 && response.rows[0]['is_admin'] == true ){

            conn.selectAll((err, response) => {
              console.log(response);
              //res.json(response.fields);       
              res.json(response.rows);       

            });
            
          } else {
            res.json({
              success: false,
              message: 'User is not admin!!'
              
            });
          }
          //client.end();
      });
    }
    
  }
  listOfArticles (req, res) {
    var email = req.body['email'];
    if(req.body['email']){
      console.log("req.query.keyword");

      console.log(req.query.keyword);
      callAPI.api(req, res, function(){
        res.json(res);    

      });
      
    }else{
      res.json({
        success: false,
        message: 'Missing keyword!!'
        
      });
    }
    
  }
  
  
}


module.exports = function(app) {
    //var jsonParser = 
    //var urlencodedParser = 
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let handlers = new HandlerGenerator();

   app.route('/about')
       .get(controller.about);
   app.route('/distance/:zipcode1/:zipcode2')
       .get(controller.getDistance);
   app.route('/addUser')
        .post(controller.addUser /*, */)   //function(request, response, next) {
      //   var keyName=request.user;
       //     console.log("test"+keyName);
       //     console.log("request::"+request.body.user);
 //      });

    app.post('/login', handlers.login);
    app.get('/profile', middleware.checkToken, handlers.profile );
    app.get('/profilesList', middleware.checkToken, handlers.profilesList );



    app.get('/listOfArticles', middleware.checkToken, handlers.listOfArticles);



    app.get('/', function(request, response) {
      response.sendFile(path.join(__dirname + '/../login/login.html'));
    });
    app.get('/register', function(request, response) {
      response.sendFile(path.join(__dirname + '/../login/register.html'));
    });

    app.post('/auth', handlers.login);
    app.route('/reg').post(controller.addUser )
    
};


