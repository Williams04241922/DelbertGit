// Script to activate member account
var db = require('./model/databaseConfig.js');

// Get email from command line argument
var email = process.argv[2];

if (!email) {
    console.log('❌ Error: Please provide an email address');
    console.log('Usage: node activateAccount.js <email>');
    console.log('Example: node activateAccount.js testuser@example.com');
    process.exit(1);
}

var conn = db.getConnection();
conn.connect(function (err) {
    if (err) {
        console.log('❌ Database connection failed:', err);
        process.exit(1);
    }

    console.log('✅ Connected to database');

    // First check if user exists
    var checkSql = 'SELECT EMAIL, NAME, ACCOUNTACTIVATIONSTATUS FROM memberentity WHERE EMAIL = ?';
    conn.query(checkSql, [email], function (err, result) {
        if (err) {
            console.log('❌ Error checking user:', err);
            conn.end();
            process.exit(1);
        }

        if (result.length === 0) {
            console.log('❌ No account found with email:', email);
            console.log('\n📋 Let me show you all registered accounts...\n');

            // Show all accounts
            var allSql = 'SELECT EMAIL, NAME, ACCOUNTACTIVATIONSTATUS FROM memberentity ORDER BY ID DESC LIMIT 10';
            conn.query(allSql, function (err, allResults) {
                if (err) {
                    console.log('❌ Error fetching accounts:', err);
                } else {
                    console.log('Recent accounts:');
                    console.log('================');
                    allResults.forEach(function(account) {
                        var status = account.ACCOUNTACTIVATIONSTATUS == 1 ? '✅ ACTIVATED' : '❌ NOT ACTIVATED';
                        console.log('Email:', account.EMAIL);
                        console.log('Name:', account.NAME || '(not set)');
                        console.log('Status:', status);
                        console.log('---');
                    });
                }
                conn.end();
                process.exit(1);
            });
            return;
        }

        var user = result[0];
        console.log('\n📧 Found account:');
        console.log('   Email:', user.EMAIL);
        console.log('   Name:', user.NAME || '(not set yet)');
        console.log('   Current Status:', user.ACCOUNTACTIVATIONSTATUS == 1 ? '✅ Already activated' : '❌ Not activated');

        if (user.ACCOUNTACTIVATIONSTATUS == 1) {
            console.log('\n✅ Account is already activated! You can login now.');
            conn.end();
            process.exit(0);
        }

        // Activate the account
        console.log('\n🔧 Activating account...');
        var updateSql = 'UPDATE memberentity SET ACCOUNTACTIVATIONSTATUS = 1 WHERE EMAIL = ?';
        conn.query(updateSql, [email], function (err, updateResult) {
            if (err) {
                console.log('❌ Error activating account:', err);
                conn.end();
                process.exit(1);
            }

            if (updateResult.affectedRows > 0) {
                console.log('✅ SUCCESS! Account has been activated!');
                console.log('\n🎉 You can now login with:');
                console.log('   Email:', email);
                console.log('   Password: (the password you registered with)');
                console.log('\n🌐 Go to: http://localhost:8081/B/SG/memberLogin.html');
            } else {
                console.log('❌ Failed to activate account');
            }

            conn.end();
            process.exit(0);
        });
    });
});
