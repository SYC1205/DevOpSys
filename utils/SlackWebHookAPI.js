/*jshint sub: true es5:true*/
/*
 * Slack Web Hook
 * Send message to Slack.
 */
var config = require("nconf");
config.env().file({ "file":"config.json" });

var Client = require('node-rest-client').Client;

module.exports = {
    sendMsg : function(text, icon, callBack){
        //var url = config.get('SLACK_WH_URL');
        var client = new Client({connection: {rejectUnauthorized: false,headers: {"Content-Type": "application/json"}}});
        /*if(!icon){
			icon = ":monkey_face:";
		}*/
        var args = {
            data:{
                "text": text,
                "icon_emoji": (icon?icon:":monkey_face:")
            }/*,
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "application/json"
            }*/
        };
        var req = client.post(config.get('SLACK_WH_URL'), args, function(data, response){
            callBack(true, data.toString("UTF-8"));
        });
        
        req.on('requestTimeout',function(req){
            console.log('request has expired');
            req.abort();
        });
 
        req.on('responseTimeout',function(res){
            console.log('response has expired');
        });

        req.on('error',function(err){
            console.log('something went wrong on the request', err);
            callBack(false, err.request.options);
        });
        
        client.on('error',function(err){
            console.error('Something went wrong on the client', err);
            callBack(false, err);
        });
    }
};