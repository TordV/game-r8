import * as React from "react";
import { Component } from "react-simplified";
import { CardGroup, GameCard, Container, Navigate, FormSelect, Loading } from "./widgets";
import { reviewService, Game, loginService, User } from "./services";

export class Collection extends Component {
  games: Game[] = [];
  filteredGames: Game[] = [];
  sortValue: string = "Sort by ID";
  genres = [];
  filterGenre: number = 0;
  userId: number = 0;
  user = new User();
  loaded: boolean = false;

  render() {
    if (this.loaded == true) {
      return (
        <Container>
          {this.userId != 0 ? (
            <>
              <h1 className="display-6 fw-bold lh-1 my-3 text-warning mx-auto">Collection</h1>
              <h6 className=" d-flex justify-content-center text-secondary">All your games in one place, what should you play today?</h6>
              <hr />
              <div className="input-group justify-content-center">
                <FormSelect
                  size="md" value={this.sortValue} onChange={(event) => {
                    this.sortValue = event.currentTarget.value;
                    this.mounted();
                  }}
                >
                  <option key={0}>Sort by ID</option>
                  <option key={1}>Alphabetically (A-Z)</option>
                  <option key={2}>Alphabetically (Z-A)</option>
                </FormSelect>
                <h5 className="fw-bold lh-1 mx-4 align-self-center"> Filter Reviews </h5>
                <FormSelect
                  size="md" value={this.filterGenre} onChange={(event) => {
                    this.filterGenre = Number(event.currentTarget.value);
                    this.mounted();
                  }}
                >
                  <option key={0} value={0}>All genres</option>
                  {this.genres.map((genre: any) => {
                    return(
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    );
                  })}
                </FormSelect>
              </div> 
              {this.filteredGames.length > 0 ? (
                <CardGroup>
                  {this.filteredGames.map((game) => {
                    return (
                      <div key={game.game_id} className="col">
                        <Navigate to={"/games/" + game.game_id}>
                          <GameCard
                            name={game.title}
                            url={game.cover.toString()}
                          />
                        </Navigate>
                      </div>
                    );
                  })}
                </CardGroup>
              ) : (
                <div className="d-flex flex-column justify-content-center py-5">
                  <h2 className="mx-auto">This was empty..</h2>
                  <h5 className="mx-auto">How about searching GameR8 for some games to add to your collection?</h5>
                  <img className="w-40 mx-auto" alt="No reviews found." src="https://c.tenor.com/WJEGCP7YXkMAAAAi/mochi-peach.gif"/>
                </div>
              )}
            </>
          ) : (
            <div className="d-flex flex-column justify-content-center py-5">
              <h1 className="display-6 fw-bold lh-1 mb-3 text-warning mx-auto">Oh-oh!</h1>
              <h4 className="mx-auto">You must be signed in to view your collection!</h4>
              <img className="w-40 mx-auto" alt="Sadge" src="https://c.tenor.com/iPf6IpTl66kAAAAj/cutie-cat.gif"/>
            </div>
          )}
        </Container>
      );
    } else {
      return (
        <Container>
          <Loading text="Loading collection..." />
        </Container>
      );
    }
  }

  mounted() {
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => this.getUser())
      .then(() => this.getGames())
      .then(() => this.loaded = true)
      .then(() => this.render())
      .catch(() => {
        // console.error("Not authorized!");
        this.loaded = true;
        this.render();
      }) 
  }

  getUser() {
    loginService
      .getUser(this.userId)
      .then((response) => (this.user = response))
  }

  getGames() {
    if (this.userId != 0) {
      reviewService
        .getGames(this.userId)
        .then((response) => (this.games = response))
        .then(() => {
          this.games.map((game) => {
            // @ts-ignore
            game.genres = JSON.parse(game.genres)
            game.genres.map((genre) => {
              const existing = this.genres.map((i: any) => i.id);
              if (!existing.includes(genre.id)) {
                // @ts-ignore
                this.genres.push(genre);
              }
            });
          })
        })
        .then(() => this.filterGames(this.filterGenre))
        .then(() => this.sortReviews(this.sortValue));
    }
  }

  filterGames(filterGenre: number) {
    if (filterGenre == 0) {
      this.filteredGames = this.games;
    } else {
      this.filteredGames = this.games.filter((game) => {
        const gameGenres: Number[] = [];
        game.genres.map(genre => gameGenres.push(genre.id));
        return gameGenres.includes(filterGenre);
      })
    }
  }

  sortReviews(sortValue: string) {
    console.log(sortValue)
    console.log(this.filteredGames)
    if (sortValue == "Sort by ID") {
      this.filteredGames.sort((a: any, b: any) => {
        if (a.game_id > b.game_id) return 1;
        if (a.game_id < b.game_id) return -1;
        return 0;
      });
    }
    else if (sortValue == "Alphabetically (A-Z)") {
      this.filteredGames.sort((a: any, b: any) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
      });
    }
    else if (sortValue == "Alphabetically (Z-A)") {
      this.filteredGames.sort((a: any, b: any) => {
        if (a.title < b.title) return 1;
        if (a.title > b.title) return -1;
        return 0;
      });
    } else {
      console.log("Error with sort value.")
    }
  }
}
