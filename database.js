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
            password: "password",
            database: 'librarydb'
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
    callStored: async function(nameOfProcedure) {
        //setup syntax
        let sql = `CALL ${`${nameOfProcedure}`}()`;

        //return a promise that a value will eventually come back
        return new Promise((resolve, reject) => {
            module.exports.dbConnection.query(sql, true, function (err, result) {
                if(err) {
                    return reject(err);
                }
                else {
                    return resolve(result[0]);
                }
            });

        });
    },
}