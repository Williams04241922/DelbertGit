// Script to list all member accounts
var db = require('./model/databaseConfig.js');

var conn = db.getConnection();
conn.connect(function (err) {
    if (err) {
        console.log('❌ Database connection failed:', err);
        process.exit(1);
    }

    console.log('✅ Connected to database\n');
    console.log('📋 REGISTERED MEMBER ACCOUNTS');
    console.log('================================\n');

    var sql = 'SELECT ID, EMAIL, NAME, PHONE, ACCOUNTACTIVATIONSTATUS, JOINDATE FROM memberentity ORDER BY ID DESC LIMIT 20';
    conn.query(sql, function (err, results) {
        if (err) {
            console.log('❌ Error fetching accounts:', err);
            conn.end();
            process.exit(1);
        }

        if (results.length === 0) {
            console.log('⚠️  No accounts found in database.');
            console.log('You need to register an account first at:');
            console.log('http://localhost:8081/B/SG/memberLogin.html');
        } else {
            results.forEach(function(account, index) {
                var status = account.ACCOUNTACTIVATIONSTATUS == 1 ? '✅ ACTIVATED' : '❌ NOT ACTIVATED';
                console.log('Account #' + (index + 1) + ':');
                console.log('  ID:', account.ID);
                console.log('  Email:', account.EMAIL);
                console.log('  Name:', account.NAME || '(not set yet)');
                console.log('  Phone:', account.PHONE || '(not set)');
                console.log('  Status:', status);
                console.log('  Registered:', account.JOINDATE);
                console.log('---');
            });

            console.log('\n💡 To activate an account, run:');
            console.log('   node activateAccount.js <email>');
            console.log('\nExample:');
            console.log('   node activateAccount.js ' + results[0].EMAIL);
        }

        conn.end();
        process.exit(0);
    });
});
