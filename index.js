const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: "avnadmin",
    password: process.env.DB_PASSWORD,
    host: "pg-popgames-0-popgames-fd4d.a.aivencloud.com",
    port: 14657,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});