'use strict'
//Define the modules we need to import
const HAPI = require('@hapi/hapi');
const GET = require('./endPointMethods/getMethods.js');
const POST = require('./endPointMethods/postMethods.js');
const PUT = require('./endPointMethods/putMethods.js');
const DELETE = require('./endPointMethods/deleteMethods.js');
var DB = require('./database.js');

//A js object that will contain the error messages we return
const errorCodeMessages = {
    EXAMPLE_MESSAGE: 'insert error messages here eventually',

};

//This method will connect to the database if it exists, or create it then connect to it

//Function to map up all the endpoints defined accres the files
const setupEndpointArray = function(arr) {
    for(var i = 0; i < GET.endPoints.length; i++) {
        arr.push(GET.endPoints[i]);
    }
    for(var i = 0; i < POST.endPoints.length; i++) {
        arr.push(POST.endPoints[i]);
    }
    for(var i = 0; i < PUT.endPoints.length; i++) {
        arr.push(PUT.endPoints[i]);
    }
    for(var i = 0; i < DELETE.endPoints.length; i++) {
        arr.push(DELETE.endPoints[i]);
    }
}

//This method sets up the server and all the endpoints
const runServer = async () => {
    var canConnectToSQL = await DB.initDBConnection();
    if(canConnectToSQL === true) {

        const server = HAPI.server({
            port: 9000,
            host: 'localhost'
        });

        const endPoints = [];
        setupEndpointArray(endPoints);
        for(var i = 0; i < endPoints.length; i++) {
            server.route(endPoints[i]);
        }
        await server.start();
        
        console.log('Server running on %s', server.info.uri);
        console.log(`On your browser navigate to ${server.info.uri}/appTest in your browser to see if the node server is working`);
        console.log(`On your browser navigate to ${server.info.uri}/dbTest in your browser to see if the mySQL database schema is setup correctly`);
    }
}
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

//Make sure to call the function that runs the server
runServer();
