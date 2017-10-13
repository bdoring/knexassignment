const env = 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');

//displays all users
app.get('/users', function(req, res) {
  knex('users')
  .then((result) => {
    res.render('index', {results: result});
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

});


//creates a new user
app.post('/users', function(req, res) {
  knex('users')
  .insert(req.body, '*')
  .then((newUser) => {
    console.log(newUser);
    res.redirect('/users');
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

//displays specific user's profile
app.get('/users/:id', function(req, res) {
  knex('users')
  .where('id', req.params.id)
  .then((result) => {
    res.render('userProfile', result[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

//edits user's information
app.get('/users/:id/edit', function(req, res) {
  knex('users')
  .where('id', req.params.id)
  .then((userInfo) => {
    res.render('userProfileEdit', userInfo[0]);
  })
});

//post changes made to user's profile
app.post('/users/:id/edit', function(req, res) {
  knex('users')
  .update(req.body, '*')
  .where('id', req.params.id)
  .then((updatedUser) => {
    res.redirect(`/users/${req.params.id}`);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

//deletes user
app.get('/users/:id/delete', function(req, res) {
  knex('users')
  .del()
  .where('id', req.params.id)
  .then((deletedUser) => {
    console.log("deleted records: ", deletedUser);
    res.redirect('/users');
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

app.listen(port, function() {
  console.log('Fala que eu te escuto:', port);
});