import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { Navigate, Alert, Carousel, Container, Header, PageFooter, HomeHero, ReviewHeroHome, SubHeaderCenter, Loading } from './widgets';
import { loginService, User, Game, Review, reviewService } from "./services";
import { Login, Register, LoggedOut } from './login';
import { Search } from './search';
import { GameDetails } from './games';
import { Reviews } from './reviews'
import { Collection } from './collection';
import { createHashHistory } from 'history';

const history = createHashHistory();

export class Menu extends Component {
  searchString: string = "";
  userId: number = 0;

  render() {
    return (
      <Header
        searchValue={this.searchString}
        onChange={(event) => (this.searchString = event.currentTarget.value)}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key == 'Enter') {
            history.push('/search/' + this.searchString)
          };
        }}
        onClick={() => history.push('/search/' + this.searchString)}
        loggedIn={this.userId != 0}
        logout={() => this.logout()}
      >
        <Navigate to="/collection"><i className="fa fa-gamepad"></i> Collection</Navigate>
        <Navigate to="/reviews"><i className="fa fa-bookmark"></i> Reviews</Navigate>
      </Header>
    );
  }

  mounted() {
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => this.render());
  }

  logout() {
    loginService
      .logout()
      .finally(() => {
        this.userId = 0; 
        history.push('/loggedout');
      })
  }
}

export class Home extends Component {
  games: Game[] = [];
  allGames: Game[] = [];
  userId: number = 0;
  user = new User();
  reviews: Review[] = [];
  loaded: boolean = false;

  render() {
    if (this.loaded == true) {
      return (
      <Container>
        {this.userId != 0 ? (
          <HomeHero 
            name={this.user.username + "."} 
            text="So you're back? Played any cool games lately? If so, why don't you leave a review on it! Feel free to browse the reviews page to get some honest opinions on games you might want to try out!"
            btn="warning"
            btn2="outline-secondary"
            btnText="Collection"
            btnText2="Reviews"
            btnTo="/collection"
            btnTo2="/reviews"
            btnLogo="gamepad"
            btnLogo2="bookmark" 
            >
              
            {this.games.length > 0 ? (
              <Carousel id="userGamesCarousel">
                {this.games.map((game, i) => {
                  let active = "";
                  if (i == 0) {active = "active"};
                  return (
                    <div key={game.id} className={"carousel-item " + active} data-bs-interval="3000">
                      <img src={game.cover.toString()} className="d-block w-100" alt="..." />
                    </div>
                  )
                })}
              </Carousel>
            ) : (
              <div className="d-flex flex-column justify-content-center py-5">
                <h2 className="mx-auto">Could not find any games..</h2>
                <h5 className="mx-auto">Games in your collection will be displayed here</h5>
                <img className="w-40 mx-auto" alt="No games found." src="https://c.tenor.com/wLeYLBVf6QgAAAAj/cry-anime.gif"/>
              </div>
            )}
          </HomeHero>
        ) : (
          <HomeHero 
            name="gamer." 
            text="Hey gamer, glad you're here. We are happy to see you have chosen GameR8 as your game rating service. Please feel free to sign in or create a user to enhance your experience."
            btn="primary"
            btn2="outline-secondary"
            btnText="Sign in"
            btnText2="Create account"
            btnTo="/login"
            btnTo2="/register"
            btnLogo="sign-in"
            btnLogo2="user-plus"
            >
            {this.allGames.length > 0 ? (
              <Carousel id="allGamesCarousel">
                {this.allGames.map((game, i) => {
                  let active = "";
                  if (i == 0) {active = "active"};
                  return (
                    <div key={game.id} className={"carousel-item " + active} data-bs-interval="3000">
                      <img src={game.cover.toString()} className="d-block w-100" alt="..." />
                    </div>
                  )
                })}
              </Carousel>
            ) : (
              <div className="d-flex flex-column justify-content-center py-5">
                <h2 className="mx-auto">Could not find any games..</h2>
                <h5 className="mx-auto">Check your internet connection and try again.</h5>
                <img className="w-40 mx-auto" alt="No games found." src="https://c.tenor.com/wLeYLBVf6QgAAAAj/cry-anime.gif"/>
              </div>
            )}
          </HomeHero>
        )}
        <hr />
        <div className="display-6 fw-bold lh-1 text-warning mx-auto">Recent reviews on GameR8</div>
        {this.reviews.length > 0 ? (
          <>
            {/* <SubHeaderCenter>Reviews written by users here @ GameR8.</SubHeaderCenter> */}
            <Carousel id="reviewCarousel">
              {this.reviews.map((review, i) => {
                let active = "";
                if (i == 0) {active = "active"};
                return (
                  <div key={review.review_id} className={"carousel-item " + active} data-bs-interval="3000">
                    <ReviewHeroHome key={review.review_id} cover={review.cover} game_id={review.game_id} user={review.username} date={review.date} game_title={review.game_title} title={review.title} details={review.details} rating={review.rating} />
                  </div>
                )
              })}
            </Carousel>
          </>
        ) : (
          <div className="d-flex flex-column justify-content-center py-5">
            <h2 className="mx-auto">Could not find any reviews..</h2>
            <img className="w-40 mx-auto" alt="No reviews found." src="https://c.tenor.com/WJEGCP7YXkMAAAAi/mochi-peach.gif"/>
          </div>
        )}
        
      </Container>
      );
    } else {
      return (
        <Container>
          <Loading text="Loading home..." />
        </Container>
      );
    }
  }

  mounted() {
    this.getAllGames();
    this.getAllReviews();
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => this.getUser())
      .then(() => this.getGames())
      .then(() => this.loaded = true)
      .then(() => this.render())
      .catch((error) => {
        // console.error("Not authorized!");
        this.loaded = true;
        this.render();
      });
  }

  getGames() {
    if (this.userId != 0) {
      reviewService
        .getGames(this.userId)
        .then((response) => (this.games = response))
    }
  }

  getAllGames() {
    reviewService
      .getAllGames()
      .then((response) => (this.allGames = response))
  }

  getAllReviews() {
    reviewService
      .getAllReviews()
      .then((response) => (this.reviews = response))
  }

  getUser() {
    loginService
      .getUser(this.userId)
      .then((response) => (this.user = response))
  }
}

class Footer extends Component {
  render() {
    return (
      <PageFooter />
    );
  }
}


const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={Home} />
        <Route exact path="/search/:searchString" component={Search} />
        <Route exact path="/reviews" component={Reviews} />
        <Route exact path="/games/:id" component={GameDetails} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/loggedout" component={LoggedOut} />
        <Route exact path="/collection" component={Collection} />
        <Footer />
      </div>
    </HashRouter>,
    root
  );