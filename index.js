var sqlServer = require('mssql');
var faker = require('faker');
var connStr = {
    user: '',
    password: '',
    server: '',
    database: '',
    requestTimeout: 0
    //stream: true
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

    var repeat = 10000;

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

    var queries = 0;
    function dbquery2(next) {

        for (var i = 0; i < repeat; i++) {
            request.query(`insert into deleteme(temp) values ('${faker.random.uuid()}')`, function(err, recordset) {
                if (err) {
                    console.log('query failed');
                    return;
                }
                if (++queries == repeat) {
                    next();
                }
            });
        }
    }

    function cb() {
        console.log('db complete');
    }

    function dbquery3() {

        for (var i = 0; i < repeat; i++) {
            (function(it) {
                request.query(`insert into deleteme(temp) values ('${faker.random.uuid()}')`, function(err, recordset) {
                    if (err) {
                        console.log('query failed');
                        return;
                    }
                    console.log('Inserted for: ' + it);
                });
            })(i)
        }
    }

    function dbqueryStreaming() {

        request.stream = true;
        request.query('update humanresources.employee set currentflag = 0');
        //request.query('select * from humanresources.employee');

        request.on('recordset', function(columns) {
            console.log('recordset');
        });

        request.on('row', function(row) {
            // Emitted for each row in a recordset
            console.log(row);
        });

        request.on('error', function(err) {
            console.log(err);
        });

        request.on('done', function(affected) {
            // Always emitted as the last one
            console.log('done');
        });
    }


    //dbquery(0);
    //dbquery2(cb);
    //dbquery3()

    dbqueryStreaming();



});


