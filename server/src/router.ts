// This file includes all API-routes (except for those related to PassportJS (login, logout, authentication, etc., which is stored in the index.ts-file))
import express from 'express';
import { registerService, reviewService } from './services'; // import services-objects with SQL-sentences to be used in API-routes towards the local database
// ts klager på manglende deklarasjon på index fila til selve pakken, ikke noe vi får gjort noe med, så ignorerer feilmeldingen
// @ts-ignore
import apicalypse from 'apicalypse'; // import library to send custom post-requests to IGDB with authentication to Twitch in header, and custom request bodies
require('dotenv').config()

// hashing-dependencies for registering users
const bcrypt = require('bcrypt');
const saltRounds = 10;

// declare the router
const router = express.Router();

// declare the IGDB-api path
const igdb_api = 'https://api.igdb.com/v4';

// Registers a user in the local DB, with password hashing + salting
router.post('/register', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (username && username.length != 0) {
    bcrypt.hash(password, saltRounds, (error: Error, hash: string) => {
      if (error) response.status(500).send(error);
      
      registerService.register(username, hash)
      .then(() => response.status(201).send('New user registered'))
      .catch((error) => response.status(500).send(error));
    });
  } else response.status(400).send("Can't register user: Missing username og password.");
});

// Retrieves a user object (id + username) by id, from the local DB, 
router.post('/getUser', (request, response) => {
  const id = request.body.id.id;
  
  if (id > 0) {
    reviewService.getUser(id)
      .then((user) => response.send(user))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Saves a game to the local DB, takes the entire game-object from the client
router.post('/saveGame', (request, response) => {
  const game = request.body.game;
  
  if (game != null) {
    reviewService.saveGame(game)
      .then(() => response.status(201).send("Saved game."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Saves a game to a users collection in the local DB, taking the game_id and user_id from the client
router.post('/saveUserGame', (request, response) => {
  const user_id = request.body.user_id.id;
  const game_id = request.body.game_id;
  
  if (game_id != null && user_id != null) {
    reviewService.saveUserGame(user_id, game_id)
      .then(() => response.status(201).send("Saved game to user-collection."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Removes a game from a users collection in the local DB, taking the game_id and user_id from the client
router.post('/removeUserGame', (request, response) => {
  const user_id = request.body.user_id.id;
  const game_id = request.body.game_id;
  
  if (game_id != null) {
    reviewService.removeUserGame(user_id, game_id)
      .then(() => response.status(200).send("Deleted game from user-collection."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Get all games from the local DB
router.get('/getAllGames', (request, response) => {
  reviewService.getAllGames()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Get all games belonging to a specific user (in user-collection) from the local DB, takes a user-id from the client
router.post('/getGames', (request, response) => {
  const id = request.body.id.id;
  
  if (id > 0) {
    reviewService.getGames(id)
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Check if a game is in a users collection in the local DB, taking a user_id and a game_id from the client
router.post('/checkForGame', (request, response) => {
  const user_id = request.body.user_id.id;
  const game_id = request.body.game_id;
  
  if (game_id != null && user_id != null) {
    reviewService.checkForGame(user_id, game_id)
      .then((game) => response.send(game))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Posts a review to the local DB, takes the entire review-object from the client
router.post('/postReview', (request, response) => {
  const review = request.body.review;
  
  if (review != null) {
    reviewService.postReview(review)
      .then(() => response.status(201).send("Added review."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Get all reviews from the local DB
router.get('/getAllReviews', (request, response) => {
  reviewService.getAllReviews()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Get all reviews for a specific game from the Local DB, takes a game_id from the client
router.post('/getGameReviews', (request, response) => {
  const game_id = request.body.game_id;

  if (game_id > 0) {
    reviewService.getGameReviews(game_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Edit a review in the local DB, takes an entire review-object from the client
router.post('/editReview', (request, response) => {
  const review = request.body.review;
  
  if (review != null) {
    reviewService.editReview(review)
      .then(() => response.status(200).send("Edited review."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Delete a review from the local DB, takes a review_id from the client
router.post('/deleteReview', (request, response) => {
  const review_id = request.body.review_id;
  
  if (review_id > 0) {
    reviewService.deleteReview(review_id)
      .then(() => response.status(200).send("Deleted review."))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Upvote a review in the local DB, takes a review_id from the client
router.post('/upvoteReview', (request, response) => {
  const review_id = request.body.review_id;

  if (review_id > 0) {
    reviewService.upvoteReview(review_id)
    .then(() => response.status(200).send("Upvoted review."))
    .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Downvote a review in the local DB, takes a review_id from the client
router.post('/downvoteReview', (request, response) => {
  const review_id = request.body.review_id;

  if (review_id > 0) {
    reviewService.downvoteReview(review_id)
    .then(() => response.status(200).send("Downvoted review."))
    .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// Get the average rating for a game from the local DB, takes a game_id from the client
router.post('/getAvgRating', (request, response) => {
  const game_id = request.body.game_id;

  if (game_id > 0) {
    reviewService.getAvgRating(game_id)
    .then((rating) => response.send(rating))
    .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required data.');
  }
});

// common options for all requests to IGDB
const requestOptions = {
  queryMethod: 'body',
  method: 'post', 
  baseURL: igdb_api, // url to IGDB API
  headers: { // authentication with twitch is required for all requests to the IGDB-API, and is included in the header of all requests
      'Client-ID': process.env.CLIENT_ID, 
      'Authorization': process.env.TWITCH_ACCESS_TOKEN
  },
  responseType: 'json', // responses should be JSON
  timeout: 5000, // 1 second timeout on the requests
};

// Request to IGDB when searching for games through the serach-field on the website
router.post('/search', async (req, res) => {
  const searchString = req.body.searchString;
  
  try {
    const response = await apicalypse(requestOptions)
      .search(searchString)
      .fields('name, cover.url')
      .where('(category=(0,2,4,6,8,9,10) & genres != null & release_dates != null & themes != (42))')
      .limit(16)
      .request('/games'); // full path https://api.igdb.com/v4/games
      
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Request to IGDB for all game info used on the website for a specific game
router.post('/game', async (req, res) => {
  const id = req.body.id;
  try {
    const response = await apicalypse(requestOptions)
    .fields('name, cover.url, aggregated_rating, rating, summary, game_modes.name, genres.name, involved_companies.company.name, parent_game.name, platforms.name, release_dates.human')    
    .where('id = ' + id)
    .request('/games'); 
        
    res.status(200).send(response.data[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Request to IGDB for similar games for a specific game
router.post('/getSimilarGames', async (req, res) => {
  const id = req.body.id;
  
  try {
    const response = await apicalypse(requestOptions)
      .fields('similar_games.name,similar_games.cover.url')
      .sort('rating desc')
      .where('(id = ' + id + ' & themes != (42))')
      .limit(1)
      .request('/games'); 
      
      res.status(200).send(response.data[0]); 
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router; // export the router