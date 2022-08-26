import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';
axios.defaults.withCredentials = true;

import { createHashHistory } from "history";
const history = createHashHistory();

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

export class User {
  user_id: number = 0;
  username: string = "";
}

export class Review {
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

class RegisterService {
  register(username: string, password: string) {
    return axios
      .post('/register', {username: username, password: password})
      .then((response) => response.data);
  }
}

class LoginService {
  login(username: string, password: string) {
    return axios
      .post('/login', { username: username, password: password })
      .then((response) => response.data)
  }

  logout() {
    return axios.get("/logout").then((response) => {
      console.log(response)
    });
  }
  
  auth() {
    return axios
      .get("/auth")
      .then((response) => response.data);
  }

  getUser(id: number) {
    return axios
      .post("/getUser", { id: id })
      .then((response) => response.data);
  }
}

class ReviewService {
  postReview(review: Review) {
    return axios
      .post("/postReview", { review: review })
      .then((response) => response.data);
  }

  saveGame(game: Game) {
    return axios
      .post("/saveGame", { game: game })
      .then((response) => response.data);
  }

  saveUserGame(user_id: number, game_id: number) {
    return axios
      .post("/saveUserGame", { user_id: user_id, game_id: game_id })
      .then((response) => response.data);
  }

  removeUserGame(user_id: number, game_id: number) {
    return axios
      .post("/removeUserGame", { user_id: user_id, game_id: game_id })
      .then((response) => response.data);
  }

  getAllGames() {
    return axios
      .get("/getAllGames")
      .then((response) => response.data);
  }

  getGames(id: number) {
    return axios
      .post("/getGames", { id: id })
      .then((response) => response.data);
  }

  checkForGame(user_id: number, game_id: number) {
    return axios
      .post("/checkForGame", { user_id: user_id, game_id: game_id })
      .then((response) => response.data);
  }

  getAllReviews() {
    return axios
      .get("/getAllReviews")
      .then((response) => response.data);
  }

  getGameReviews(game_id: number) {
    return axios
      .post("/getGameReviews", { game_id: game_id })
      .then((response) => response.data);
  }

  getAvgRating(game_id: number) {
    return axios
      .post("/getAvgRating", { game_id: game_id })
      .then((response) => response.data.avg);
  }

  editReview(review: Review) {
    return axios
      .post("/editReview", { review: review })
      .then((response) => response.data);
  }

  deleteReview(review_id: number) {
    return axios
      .post("/deleteReview", { review_id: review_id })
      .then((response) => response.data);
  }

  upvoteReview(review_id: number) {
    return axios
      .post("/upvoteReview", { review_id: review_id })
      .then((response) => response.data);
  }

  downvoteReview(review_id: number) {
    return axios
      .post("/downvoteReview", { review_id: review_id })
      .then((response) => response.data);
  }
}

// class for IGDB API calls
class IGDB {
  // metoden som kalles når en søker etter et spill gjennom search bar
  searchForGames(searchString: string) {
    return axios
      .post('/search', { searchString: searchString })
      .then((response) => response.data);
  }

  // metoden som kalles når en trykker på et spill i søkeresultat, eller går til et vilkårlig spill gjennom URL: .../games/:id
  getGame(id: number) {
    return axios
      .post<Game>('/game', { id: id })
      .then((response) => response.data);
  }

  getSimilarGames(id: number) {
    return axios
      .post('/getSimilarGames', {id: id})
      .then((response) => response.data.similar_games);
  }
}

const registerService = new RegisterService();
const loginService = new LoginService();
const igdbService = new IGDB();
const reviewService = new ReviewService();
 
export { registerService, loginService, igdbService, Cover, reviewService };
