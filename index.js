var sqlServer = require('mssql');
var connStr = {
    user: '',
    password: '',
    server: '',
    database: '',
};
var connection = new sqlServer.Connection(connStr);

connStr.user = process.argv[2];
connStr.password = process.argv[3];;
connStr.server = process.argv[4];;
connStr.database = process.argv[5];;

if (process.argv.length !== 6) {
    console.log('Error: SQL credentials not passed.  Please run program using \'node index.js [username] [password] [server] [database]\'');
    process.exit(1);
}

connection.connect(function(err) {
   if (err) {
       console.log('failed to connect: ' + err);
       return;
   } 
   console.log('successfully connected');

    var request = new sqlServer.Request(connection);

    /*
    request.query('select * from humanresources.employee', function(err, recordset) {
       if (err) {
           console.log('query failed');
       }  else {
           console.log(recordset);
       }
    });
    */

    var repeat = 5;

    function dbquery(i) {
        if (i < repeat) {
            request.query('select * from humanresources.employee', function(err, recordset) {
                if (err) {
                    console.log('query failed');
                }  else {
                    console.log('query succeeded: ' + i);
                    dbquery(i+1);
                }
            });
        }
    }

    dbquery(0);
});

