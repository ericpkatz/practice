// imports here for express and pg
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_db');
const express = require('express');
const app = express();
const path = require('path');


app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
app.get('/', (req, res)=> {
  const file = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(file);
});

app.get('/api/notes', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT * 
      FROM notes;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  }
  catch(ex){
    next(ex);
  }
});


// static routes here (you only need these for deployment)

// app routes here

// create your init function

// init function invocation
const init = async()=> {
  await client.connect();
  console.log('connected');
  let SQL = `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      txt VARCHAR(100),
      starred BOOLEAN DEFAULT false
    );
  `;
  await client.query(SQL);
  console.log('tables created.');
  SQL = `
    INSERT INTO notes(txt) VALUES('hello');
    INSERT INTO notes(txt, starred) VALUES('world', true);
  `;
  await client.query(SQL);
  console.log('data seeded');
  
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
}

init();

