// Script to reset member password
var db = require('./model/databaseConfig.js');
var bcrypt = require('bcryptjs');

var email = process.argv[2];
var newPassword = process.argv[3];

if (!email || !newPassword) {
    console.log('❌ Error: Please provide email and new password');
    console.log('Usage: node resetPassword.js <email> <newPassword>');
    console.log('Example: node resetPassword.js test@example.com Password123');
    process.exit(1);
}

var conn = db.getConnection();
conn.connect(function (err) {
    if (err) {
        console.log('❌ Database connection failed:', err);
        process.exit(1);
    }

    console.log('✅ Connected to database');

    // Check if user exists
    var checkSql = 'SELECT EMAIL, NAME FROM memberentity WHERE EMAIL = ?';
    conn.query(checkSql, [email], function (err, result) {
        if (err) {
            console.log('❌ Error checking user:', err);
            conn.end();
            process.exit(1);
        }

        if (result.length === 0) {
            console.log('❌ No account found with email:', email);
            conn.end();
            process.exit(1);
        }

        console.log('\n📧 Found account:', email);
        console.log('🔧 Resetting password...\n');

        // Hash the new password
        bcrypt.hash(newPassword, 5, function(err, hash) {
            if (err) {
                console.log('❌ Error hashing password:', err);
                conn.end();
                process.exit(1);
            }

            var updateSql = 'UPDATE memberentity SET PASSWORDHASH = ? WHERE EMAIL = ?';
            conn.query(updateSql, [hash, email], function (err, updateResult) {
                if (err) {
                    console.log('❌ Error resetting password:', err);
                    conn.end();
                    process.exit(1);
                }

                if (updateResult.affectedRows > 0) {
                    console.log('✅ SUCCESS! Password has been reset!\n');
                    console.log('🎉 You can now login with:');
                    console.log('   Email:', email);
                    console.log('   Password:', newPassword);
                    console.log('\n🌐 Go to: http://localhost:8081/B/SG/memberLogin.html');
                } else {
                    console.log('❌ Failed to reset password');
                }

                conn.end();
                process.exit(0);
            });
        });
    });
});
