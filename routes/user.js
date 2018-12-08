const express = require('express');
const pg = require('pg');


//Connect Express Server to Postgress
const config = {
  user: 'postgres',
  database: 'jsondata',
  password: 123456,
  port: 5432,
}
// Query postgress using pool
const pool = new pg.Pool(config);


//creates routes for different requests
const router = express.Router()


router.get('/messages', (req, res) => {
  console.log('Show Messages Now!!')
  res.end('hello')
})


// Sending Json object to page
// **Change table to table querying
router.get('/users', (req, res) => {
  pool.connect()
  .then(() => {
    // Shows all users -> ('SELECT * FROM users')
    const sql = 'SELECT * FROM jsondata'
    return pool.query(sql);
  })
  .then((data) => {
    res.send(data.rows);
  })
})


router.get('/users/:id', (req, res) => {
  // id stored in req.params.id
  console.log('Fetch user id:' + req.params.id)
  //fetch data from postgres
  pool.connect()
    .then(() => {
      // Shows all users -> ('SELECT * FROM users')
      // const sql = 'SELECT * FROM users'

      // Filters users by id ->
      const sql = 'SELECT * FROM users WHERE id = $1;'
      const params = [req.params.id];
      return pool.query(sql, params);
    })
    .then((data) => {

  // Returns all row info    
      res.json(data.rows)
    })
    .catch((err) => {
  // if error will send 404 response to header    
      res.sendStatus(404).res.send('Something went wrong')
    })
  // res.end()
})


//To accass the form page need to go to localhost:currentPort/form.html
router.post('/usercreate', (req, res) => {
  console.log('Creating a new User?....')

  // get values inside input field
  const firstName = req.body.create_first_name;
  const lastName = req.body.create_last_name;
  
  // store values inside postgres
  pool.connect()
    .then(() => {
      const sql = 'INSERT INTO users (firstname, lastname) VALUES ($1, $2)'
      const params = [firstName, lastName];
      return pool.query(sql, params);
    })
    .then((result) => {
      console.log(`Results`, result)
      res.redirect('/form.html')
    })
    .catch((err) => {
      res.sendStatus(404).res.send('Something Happend')
    })
})





module.exports = router;