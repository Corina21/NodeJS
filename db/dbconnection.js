var pg = require('pg');
var conString = "postgres://corina:corina123@localhost:5432/corina";

var client = new pg.Client(conString);

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


var query = {
    add: function(email, pwd, name, surname, is_admin, fn) {
        client.query("INSERT INTO users (email, password, name, surname, is_admin) VALUES ('"+email+"', '"+pwd+"', '"+name+"', '"+surname+"', "+is_admin+");",
            (err, res) => {
                if (err) {
                    fn(err);
                    console.log('Insert into requests unsuccessful.');
                    console.log('ERROR: ' + err);
                }else{
                    fn(null, true);
                    console.log('SUCCESS!');
                }               
            }
        );
    },
    checkUser: function(email, password, fn){
        client.query("SELECT * FROM users WHERE email ='"+email+"' AND password = '"+password+"';",
            (err, response) => {
                fn(err, response);
                //client.end();
            }
        );
    },
    selectByEmail: function(email, fn){
        client.query("SELECT name, surname, is_admin FROM users WHERE email ='"+email+"' ;", (err, response) => {
            console.log(response.rows[0]);
            fn(err,response);
        });
    },
    selectAll(fn){
        client.query("SELECT email, name, surname, is_admin  FROM users ;", (err, response) => {
            fn(err,response);
        });
    }

    //client.end();

}

module.exports = query;