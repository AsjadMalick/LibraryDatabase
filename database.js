const MYSQL = require('mysql');
module.exports = {
    //Variable to store the connection so it is accessable by other files
    dbConnection: '',

    //Call this to initlaize the database connection
    initDBConnection: async function() {
        //See if mySQL can be connected to
        module.exports.dbConnection = MYSQL.createConnection({
            host: "localhost",
            user: "root",
            password: "McL0v1n?",
            database: 'library_db'
        });

        return new Promise((resolve, reject) => {
            module.exports.dbConnection.connect(function(err) {
                if (err) {
                    console.log('Could not connect to librarydb');
                    return reject(err);
                }
                else {
                    console.log("Connected to mySQL librarydb");
                    return resolve(true);
                }
            });

        });
    },

    // Calls stored procedure
    callStored: async function(nameOfProcedure, arr) {

        //Initialize the array if not initialized
        arrayOfParams = arr || [];
        let sql = `CALL ${`${nameOfProcedure}`}(`;
        let sqlParams = '';

        for(var i = 0; i < arrayOfParams.length; i++) {
            //console.log(arrayOfParams[i]);
            sqlParams = sqlParams + '"' + arrayOfParams[i] + '"';
            if(i != arrayOfParams.length - 1) {
                sqlParams = sqlParams + ',';
            }
        }
        sql = sql + sqlParams + ')';

        //return a promise that a value will eventually come back
        return new Promise((resolve, reject) => {
            module.exports.dbConnection.query(sql, true, function (err, result) {
                if (err) {
                    console.log(`query ${sql} failed`);
                    return reject(err);
                }
                else {
                    console.log(`query ${sql} success`);
                    //console.log("Result: %s", result);
                    //console.log("result[0]: %s", result[0]);
                    // checks for null or undefined values
                    if (result[0] == null) {
                        return resolve(`Query successful with results: ` + JSON.stringify(result));

                    } else {
                        return resolve(result[0]);
                    }
                }
            });

        });
    },
}