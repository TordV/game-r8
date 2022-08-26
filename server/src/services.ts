import db from './mysql-pool'; // import the database-pool

const bcrypt = require('bcrypt');

// this class consists of all database-calls related to the games and reviews on the website
class ReviewService {
  // Get a single user by id
  getUser(id: number) {
    return new Promise<User>((resolve, reject) => {
      db.query('SELECT user_id, username FROM users WHERE user_id = ?', [id], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        resolve(results[0]);
      });
    });
  }

  // Get all games
  getAllGames() {
    return new Promise<Game[]>((resolve, reject) => {
      db.query('SELECT * FROM game', (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  // Get a single game by id
  getGames(id: number) {
    return new Promise<Game[]>((resolve, reject) => {
      db.query('SELECT * FROM game WHERE game_id IN (SELECT game_id FROM user_games WHERE user_id = ?)', [id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  // Save a game with id, name, cover-url and genres (json)
  saveGame(game: Game) {
    return new Promise<void>((resolve, reject) => {
      db.query('INSERT INTO game (game_id, title, cover, genres) VALUES (?, ?, ?, ?)', 
      [game.id, game.name, game.cover.url, JSON.stringify(game.genres)],
      (error, results) => {
        if (error) console.log("Game already exists at local database.");

        resolve();
      });
    });
  }

  // Save a game to a users collection with user-id and game-id
  saveUserGame(user_id: number, game_id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query('INSERT INTO user_games (user_id, game_id) VALUES (?, ?)', 
      [user_id, game_id],
      (error, results) => {
        if (error) console.log("Game already in user collection.");

        resolve();
      });
    });
  }

  // Remove a game from a users collection with user-id and game-id
  removeUserGame(user_id: number, game_id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query('DELETE FROM user_games WHERE user_id = ? AND game_id = ?', 
      [user_id, game_id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // Check if a game is in a users collection with user-id and game-id
  checkForGame(user_id: number, game_id: number) {
    return new Promise<Game[]>((resolve, reject) => {
      db.query('SELECT * FROM user_games WHERE user_id = ? AND game_id = ?', [user_id, game_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  // get all reviews ordered by relevance (upvotes)
  getAllReviews() {
    return new Promise<Review[]>((resolve, reject) => {
      db.query('SELECT review.*, DATE_FORMAT(review.review_date, "%e %M %Y") AS date, users.username, game.title AS game_title, game.cover, game.genres FROM review INNER JOIN users ON review.user_id = users.user_id INNER JOIN game ON review.game_id = game.game_id ORDER BY review.relevance DESC', 
      (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  // get all reviews for a game by game_id, ordered by relevance (upvotes)
  getGameReviews(game_id: number) {
    return new Promise<Review[]>((resolve, reject) => {
      db.query('SELECT review.*, DATE_FORMAT(review.review_date, "%e %M %Y") AS date, users.username FROM review INNER JOIN users ON review.user_id = users.user_id WHERE game_id = ? ORDER BY review.relevance DESC', 
      [game_id], (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  // get average ratings from all reviews for a game, by game_id
  getAvgRating(game_id: number) {
    return new Promise<number>((resolve, reject) => {
      db.query('SELECT AVG(rating) AS avg FROM review WHERE game_id = ?', 
      [game_id], (error, results) => {
        if (error) return reject(error);

        resolve(results[0]);
      });
    });
  }

  // save a review for a game, by a user, with title, details and rating
  postReview(review: Review) {
    return new Promise<void>((resolve, reject) => {
      db.query('INSERT INTO review (user_id, game_id, title, details, rating, review_date) VALUES (?, ?, ?, ?, ?, CURRENT_DATE())', 
      [review.user_id, review.game_id, review.title, review.details, review.rating], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // edit a review
  editReview(review: Review) {
    return new Promise<void>((resolve, reject) => {
      db.query('UPDATE review SET title = ?, details = ?, rating = ? WHERE review_id = ?', 
      [review.title, review.details, review.rating, review.review_id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // delete a review by review_id
  deleteReview(review_id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query('DELETE FROM review WHERE review_id = ?', 
      [review_id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // upvote a review by review_id
  upvoteReview(review_id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query('UPDATE review SET relevance = relevance + 1 WHERE review_id = ?', 
      [review_id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // downvote a review by review_id
  downvoteReview(review_id: number) {
    return new Promise<void>((resolve, reject) => {
      db.query('UPDATE review SET relevance = relevance - 1 WHERE review_id = ?', 
      [review_id], (error, results) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}
export type testUser = {
  user_id: number;
  username: string;
  passwd: string;
}

class User {
  user_id: number = 0;
  username: string = "";
}

class Review {
  review_id: number = 0;
  user_id: number = 0;
  game_id: number = 0;
  title: string = "";
  details: string = "";
  rating: string = "0";
  relevance: number = 0;
  username: string = "";
  game_title: string = "";
  cover: string = "";
  genres: string = "";
  date: string = "";
}

export class Game {
  game_id: number = 0;
  id: number = 0;
  name: string = "";
  title: string = "";
  cover = new Cover();
  summary: string = "";
  genres: Genre[] = [];
  release_dates: Date[] = [];
  aggregated_rating: number = 0;
  rating: number = 0;
  game_modes: GameMode[] = [];
  involved_companies: CompanyId[] = [];
  parent_game = new ParentGame();
  platforms: Platform[] = [];
}

class Cover {
  id: number = 0; 
  url: string = "";
}

type Platform = {
  id: number;
  name: string;
}

type GameMode = {
  id: number;
  name: string;
}

type Genre = {
  id: number;
  name: string;
}

class CompanyId {
  id: number = 0;
  company = new Company();
}

class Company {
  id: number = 0;
  name: string = "";
}

class ParentGame {
  id: number = 0;
  name: string = "";
}

type Date = {
  id: number;
  human: string;
}

// class for database-call to register a user
class RegisterService {
  register(username: string, password: string) {
    return new Promise<number>((resolve, reject) => {
      db.query('INSERT INTO users (username, passwd) VALUES (?, ?)', [username, password], (error, results) => {
        if (error) {
          if (error.errno = 1062) {
            return reject("A user with this username already exist.")
          } else {
            return reject(error);
          }
        }

        resolve(Number(results.insertId));
      });
    });
  }
}

// class for database-call to login and getting user-credentials for authentication
class LoginService {
  login(username: string, password: string) {
    return new Promise<{}>((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        bcrypt.compare(password, results[0].passwd, (err: Error, response: boolean) => {
          if (err) return reject(err);

          if (response) {
            resolve(results);
          } else {
            return reject({ message: 'Incorrect username or password.' });
          }
        })
      });
    });
  }

  getUserByUsername(username: string) {
    return new Promise<{}>((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        resolve(results[0]);
      });
    });
  }

  getUserById(id: number) {
    return new Promise<{}>((resolve, reject) => {
      db.query('SELECT * FROM users WHERE user_id = ?', [id], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        resolve(results[0]);
      });
    });
  }
}

// save instances of classes
const registerService = new RegisterService();
const loginService = new LoginService();
const reviewService = new ReviewService();

// export the instances
export { registerService, loginService, reviewService };