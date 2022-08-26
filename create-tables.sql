DROP TABLE IF EXISTS user_games;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(16) NOT NULL,
  passwd CHAR(128) NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE game (
  game_id INT NOT NULL,
  title VARCHAR(255),
  cover VARCHAR(255),
  genres VARCHAR(999),
  PRIMARY KEY(game_id)
);

CREATE TABLE review (
  review_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  title VARCHAR(32) NOT NULL,
  details VARCHAR(999),
  rating CHAR(1) NOT NULL,
  relevance INT DEFAULT 0,
  review_date DATE NOT NULL,
  PRIMARY KEY(review_id),
  CONSTRAINT FK_review1 FOREIGN KEY(user_id)
  REFERENCES users(user_id),
  CONSTRAINT FK_review2 FOREIGN KEY(game_id)
  REFERENCES game(game_id)
);

CREATE TABLE user_games (
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  PRIMARY KEY (user_id, game_id),
  CONSTRAINT FK_user_games1 FOREIGN KEY (user_id)
  REFERENCES users(user_id),
  CONSTRAINT FK_user_games2 FOREIGN KEY (game_id)
  REFERENCES game(game_id)
);