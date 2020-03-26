'use strict'
//Define the modules we need to import
const HAPI = require('@hapi/hapi');
const JOI = require('@hapi/joi');
const BOOM = require('@hapi/boom');
const GETMETHODS = require('./getMethods.js');

//A js object that will contain the error messages we return
const errorCodeMessages = {
    EXAMPLE_MESSAGE: 'insert error messages here eventually',

};

//The schema we validate input against
//const joiValidationSchema;

//Define the endpoints here as well as what function they call and use
const endPoints = [
    {
        method: 'GET',
        path: '/appTest',
        handler: async (request, h) => {
            var result = GETMETHODS.getTestServerStuff();
            return result;
        }
    },
    {
        method: 'GET',
        path: '/getBranchInfo',
        handler: async (request, h) => {
            var result = GETMETHODS.getBranchInfo();
            return result;
        }
    },
];

//This method sets up the server and all the endpoints
const runServer = async () => {
    const server = HAPI.server({
        port: 9000,
        host: 'localhost'
    });

    for(var i = 0; i < endPoints.length; i++) {
        server.route(endPoints[i]);
    }

    await server.start();
    console.log('Server running on %s', server.info.uri);
    
    console.log(`On your browser navigate to ${server.info.uri}/appTest in your browser to see if it is working`)
}
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
runServer();
