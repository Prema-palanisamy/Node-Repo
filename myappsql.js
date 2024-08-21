const mysql = require('mysql2/promise');

async function main() {
    const pool = mysql.createPool({
        socketPath: '/cloudsql/durable-circle-433106-g9:us-central1:spacevote-instance', // Ensure this path is correct
        user: 'prema', // Use environment variables for sensitive information
        password: 'Admin@123', // Use environment variables for sensitive information
        database: 'votecast' // Use environment variables for sensitive information
    });

    try {
        const [rows, fields] = await pool.query('SELECT * FROM vote_table');
        console.log('Query results:', rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await pool.end();
    }
}

main();
