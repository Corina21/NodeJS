var request = require('request');
const NodeCache = require( "node-cache" );
const ttl = 1; // cache for 1 Hour
const myCache = new NodeCache({checkperiod: 120 });

var call = {
   api: function(req, res, next) {
       console.log(req.query.keyword);
       var keyword = req.query.keyword;
       var headers = {
            'Authorization': 'kWGgKyL7s448J7jz8yHInDTvgMf2NuaPaK_qThftwWLM3ODW',
            'cache-control': 'no-cache',
         }
      
    // Configure the request
    var options = {
        url: 'https://api.currentsapi.services/v1/search?keywords='+keyword+'&language=en',
        method: 'GET',
        headers: headers
    }
    if(myCache.has(keyword)){

        res.send(myCache.get(keyword));
    }else{
        request.get(options, function (error, response, body) {
            // your callback body
            console.log("method");
            console.log(body);
    
            if (!error && response.statusCode == 200) {
                response = JSON.parse(body);
                console.log(response);
    
                myCache.set(keyword,response, 1800);
                res.send(response);
    
    
            } else {
                console.log(response.statusCode + response.body);
                res.send({distance: -1});
            }
        });
    }
    
   }
};

module.exports = call;
