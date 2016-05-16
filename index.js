var sqlServer = require('mssql');
var connStr = {
    user: '',
    password: '',
    server: '',
    database: '',
};
var connection = new sqlServer.Connection(connStr);

process.argv.forEach(function(val, index, array) {
    if (index === 2) {
        connStr.user = val;
    }
    if (index === 3) {
        connStr.password = val;
    }
    if (index === 4) {
        connStr.server = val;
    }
    if (index === 6) {
        connStr.database = val;
    }
    if (array.length !== 6) {
        console.log('Error: SQL credentials not passed.  Please run program using \'node index.js [username] [password] [server] [database]\'');
        process.exit(1);
    }
});


connection.connect(function(err) {
   if (err) {
       console.log('failed to connect: ' + err);
       return;
   } 
   console.log('successfully connected');
});

