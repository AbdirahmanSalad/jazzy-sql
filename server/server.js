const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 5000;
const Pool = pg.Pool;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
    console.log('pg connected to postgresql!');
});

pool.on('error', (error) => {
    console.log('Unable to connect to postgres', error);
});

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

app.get('/artist', (req, res) => {
    const queryText = 'SELECT * FROM "artist" ORDER BY "birthdate" ASC LIMIT 100;';
    pool.query(queryText).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        res.sendStatus(500);
    });   
    console.log(`In /songs GET`);
    //res.send(artistList);
}); 

app.post('/artist', (req, res) => {
    const newArtist = req.body;
    const queryText = `INSERT INTO "artist" ("name", "birthdate")
        VALUES ($1 $2);`;
    pool.query(queryText, [
        newArtist.name,
        newArtist.birthdate,
    ]).then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('Error in POST', error);
        res.sendStatus(500);
    });
});

app.get('/song', (req, res) => {
    console.log(`In /songs GET`);
    //res.send(songList);
});

app.post('/song', (req, res) => {
    songList.push(req.body);
    res.sendStatus(201);
});


