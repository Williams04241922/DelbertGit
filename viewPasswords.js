// Script to show password hashes (NOT actual passwords!)
var db = require('./model/databaseConfig.js');

var conn = db.getConnection();
conn.connect(function (err) {
    if (err) {
        console.log('❌ Database connection failed:', err);
        process.exit(1);
    }

    console.log('✅ Connected to database\n');
    console.log('🔐 VIEWING PASSWORD HASHES (NOT actual passwords!)');
    console.log('====================================================\n');
    console.log('⚠️  IMPORTANT: Passwords are HASHED and CANNOT be reversed!\n');

    var sql = 'SELECT EMAIL, PASSWORDHASH FROM memberentity WHERE EMAIL IN (?, ?, ?) ORDER BY EMAIL';
    conn.query(sql, ['123@gmail.com', 'xiaotan1133@gmail.com', 'yemana637@gmail.com'], function (err, results) {
        if (err) {
            console.log('❌ Error:', err);
            conn.end();
            process.exit(1);
        }

        results.forEach(function(account) {
            console.log('Email:', account.EMAIL);
            console.log('Hashed Password:', account.PASSWORDHASH);
            console.log('👆 This is gibberish - you CANNOT reverse it to get the real password!');
            console.log('---\n');
        });

        console.log('💡 What you CAN do:');
        console.log('   1. Use the password you remember when you registered');
        console.log('   2. Reset the password using: node resetPassword.js <email> <newPassword>');
        console.log('\n✅ Passwords already reset:');
        console.log('   - xiaotan1133@gmail.com → Password123');
        console.log('   - 123@gmail.com → (your original password when you registered)');

        conn.end();
        process.exit(0);
    });
});
