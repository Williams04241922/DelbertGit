// Script to add test data to a member account
var db = require('./model/databaseConfig.js');

var email = process.argv[2];

if (!email) {
    console.log('❌ Error: Please provide an email address');
    console.log('Usage: node addTestData.js <email>');
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
        console.log('🔧 Adding test data...\n');

        // Add test data
        var updateSql = 'UPDATE memberentity SET NAME=?, PHONE=?, CITY=?, ADDRESS=?, SECURITYQUESTION=?, SECURITYANSWER=?, AGE=?, INCOME=?, SERVICELEVELAGREEMENT=? WHERE EMAIL=?';
        var testData = [
            'John Doe',              // Name
            '91234567',              // Phone
            'Singapore',             // City (Country)
            '123 Orchard Road',      // Address
            '1',                     // Security Question (1 = mother's maiden name)
            'Smith',                 // Security Answer
            '25',                    // Age
            '50000',                 // Income
            1,                       // Service Level Agreement (1 = yes)
            email                    // Email
        ];

        conn.query(updateSql, testData, function (err, updateResult) {
            if (err) {
                console.log('❌ Error adding test data:', err);
                conn.end();
                process.exit(1);
            }

            if (updateResult.affectedRows > 0) {
                console.log('✅ SUCCESS! Test data added to account!\n');
                console.log('📋 Account now has:');
                console.log('   Name: John Doe');
                console.log('   Phone: 91234567');
                console.log('   Country: Singapore');
                console.log('   Address: 123 Orchard Road');
                console.log('   Security Question: What is your mother\'s maiden name?');
                console.log('   Security Answer: Smith');
                console.log('   Age: 25');
                console.log('   Income: 50000');
                console.log('   SLA: Yes (checked)');
                console.log('\n🎯 NOW you can test the bug!');
                console.log('🌐 Login at: http://localhost:8081/B/SG/memberLogin.html');
                console.log('   Email: ' + email);
                console.log('\n📝 After login, the profile form should show this data...');
                console.log('   BUT IT WILL BE EMPTY! (That\'s the bug!)');
            } else {
                console.log('❌ Failed to add test data');
            }

            conn.end();
            process.exit(0);
        });
    });
});
