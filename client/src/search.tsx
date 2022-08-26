import * as React from "react";
import { Component } from "react-simplified";
import { CardGroup, GameCard, Container, Navigate, Loading } from "./widgets";
import { igdbService, Game } from "./services";

export class Search extends Component<{match: { params: { searchString: string } }}> {
  games: Game[] = [];
  loaded: boolean = false;

  render() {
    if (this.loaded) {
      return (
        <Container>
          {this.games.length !== 0 ? (
          <>
            <h1 className="display-6 fw-bold lh-1 my-3 text-warning mx-auto">Search results</h1>
            <h6 className=" d-flex justify-content-center text-secondary">Click a game for more info, or keep exploring</h6>
            <hr />
            <CardGroup>
              {this.games.map((game) => {
                return (
                  <div key={game.id} className="col">
                    <Navigate to={"/games/" + game.id}>
                      <GameCard
                        name={game.name}
                        url={game.cover ? game.cover.url.replace("thumb", "cover_big") : ""}
                      />
                    </Navigate>
                  </div>
                );
              })}
            </CardGroup>
          </>
          ) : (
            <div className="d-flex flex-column my-4 justify-content-center">
              <h2 className="mx-auto">The game you are looking for could not be found in the IGDB database..</h2>
              <img className="mx-auto" alt="Sadge" src="https://c.tenor.com/kZ0XPsvtqw8AAAAi/cat-farsi-sad.gif"/>
            </div>
          )}
        </Container>
      );
    } else {
      return (
        <Container>
          <Loading text="Searching for games..." />
        </Container>
      );
    }  
  }

  mounted() {
    if (this.loaded = true) {
      this.loaded = false;
      this.render();
      igdbService
        .searchForGames(this.props.match.params.searchString)
        .then((response) => (this.games = response))
        .then(() => this.loaded = true)
        .then(() => this.render());
    } else {
      igdbService
        .searchForGames(this.props.match.params.searchString)
        .then((response) => (this.games = response))
        .then(() => this.loaded = true)
        .then(() => this.render());
    }
  }
}
