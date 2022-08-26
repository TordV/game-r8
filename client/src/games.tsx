import * as React from 'react';
import { Component } from 'react-simplified';
import { Error, CardGroup, GameCard, Navigate, Container, ReviewInput, ReviewInputArea, SubHeader, FormRating, Alert, Modal, ModalHeader, ModalBody, ModalFooter, GameHero, ReviewHero, HeroFooter, ReviewHeroUpvotes, GameInfo, GameInfoProp, ReviewList, SimilarGames, SubHeaderCenter, Loading } from './widgets';
import { igdbService, Game, User, reviewService, Review, loginService } from './services';

export class GameDetails extends Component<{
  match: { params: { id: number } };
}> {
  game = new Game();
  title: string = "";
  details: string = "";
  rating: string = "0";
  review = new Review();
  reviews: Review[] = [];
  avgRating: number = 0;
  similarGames: Game[] = [];
  userId: number = 0;
  user = new User();
  inCollection: boolean = false;
  titleError: boolean = false;
  loaded: boolean = false;

  render() {
    if (this.loaded == true) {
      return (
        <Container> 
          {/* Spill */}
          <GameHero 
            cover={this.game.cover ? this.game.cover.url.replace("thumb", "cover_big") : "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"}
            name={this.game.name}
            summary={this.game.summary ? this.game.summary : "This game does not have a description."}>
            <HeroFooter notice={this.userId == 0 ? "Log in to write your own reviews and build your collection!" : ""}>
              <button type="button" className="btn btn-warning btn-lg px-4 me-md-2" disabled={this.userId == 0} data-bs-toggle="modal" data-bs-target="#createReview" data-bs-whatever="@mdo"><i className="fa fa-pencil-square-o "></i> Review </button>
              {this.inCollection ? (
                <button type="button" className="btn btn-outline-danger btn-lg px-4" disabled={this.userId == 0} onClick={() => this.removeUserGame()}><i className="fa fa-trash"></i> Remove From Collection </button>
              ) : (
                <button type="button" className="btn btn-outline-secondary btn-lg px-4" disabled={this.userId == 0} onClick={() => this.saveGame()}><i className="fa fa-plus"></i> Add to Collection </button>
              )}              
              <Modal id="createReview">
                <ModalHeader title={"What did you think about " + this.game.name + " " + this.user.username + "?"} />
                <ModalBody>
                  <ReviewInput type="text" value={this.review.title} name="Title" onChange={(event) => (this.review.title = event.currentTarget.value)}></ReviewInput>
                  <ReviewInputArea value={this.review.details} name="Write your review here.." onChange={(event) => (this.review.details = event.currentTarget.value)}></ReviewInputArea>
                  <FormRating rating={this.review.rating} onChange={(event) => (this.review.rating = event.currentTarget.value)}/>
                  {this.titleError ? <Error title="Not so fast!" text="Your review needs a title." type="warning" /> : ""}
                </ModalBody>
                <ModalFooter>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss={this.review.title != "" ? "modal" : ""}
                    onClick={() => {
                      if (this.review.title == "") {
                        this.titleError = true;
                        this.render()
                      } else {
                        this.submitReview();
                      }
                    }
                  }>Submit review</button>
                </ModalFooter>
              </Modal>
            </HeroFooter>
            <br/>
            <p className="lead fs-5"><i className="fa fa-star"></i>{(this.reviews.length > 0 && this.avgRating != null) ? (" Average rating " + this.avgRating.toFixed(1) + " / 5.0") : " No reviews yet!"}</p>
          </GameHero>
          <hr />
          {/* Spill-detaljer */}
          <GameInfo game_title={this.game.name}>
            <GameInfoProp property="Released">
              <SubHeader>{this.game.release_dates[0] ? this.game.release_dates[0].human : "N/A"}</SubHeader>
            </GameInfoProp>
            <GameInfoProp property="Developers">
              {this.game.involved_companies ? this.game.involved_companies.map((companyId) => {
                return ( 
                  <div key={companyId.company.id}>
                    <SubHeader>{(companyId.company.id != 0) ? companyId.company.name : "N/A"}</SubHeader> 
                  </div>
                )
              }) : <SubHeader>N/A</SubHeader>}
            </GameInfoProp>
            <GameInfoProp property="Genres">
              {this.game.genres.map((genre) => {
                return ( 
                  <div key={genre.id}>
                    <SubHeader>{genre.name}</SubHeader>
                  </div>
                )
              })}
            </GameInfoProp>
            <GameInfoProp property="Platforms">
              {this.game.platforms ? this.game.platforms.map((platform) => {
                return ( 
                  <div key={platform.id}>
                    <SubHeader>{platform.name}</SubHeader> 
                  </div>
                )
              }) : <SubHeader>N/A</SubHeader>}
            </GameInfoProp>
            <GameInfoProp property="Gamemodes">
              {this.game.game_modes ? this.game.game_modes.map((mode) => {
                return (
                  <div key={mode.id}>
                    <SubHeader>{mode.name}</SubHeader> 
                  </div>
                )
              }) : <SubHeader>N/A</SubHeader>}
            </GameInfoProp>
            <GameInfoProp property="Part of..">
              <SubHeader>{this.game.parent_game ? this.game.parent_game.name : "N/A"}</SubHeader>
            </GameInfoProp>
          </GameInfo>
          <hr />
          {/* Reviews */}
          <ReviewList game_title={this.game.name}>
            {this.reviews.length == 0 ? (
              <div className="d-flex flex-column justify-content-center py-4">
                <h1 className="display-6 fw-bold lh-1 mb-3 text-warning mx-auto">No reviews yet</h1>
                <h4 className="mx-auto">If you have tried <cite title="Source Title">{this.game.name}</cite>, let us know what you think!</h4>
                <img className="w-40 mx-auto" alt="Sadge" src="https://c.tenor.com/WJEGCP7YXkMAAAAi/mochi-peach.gif"/>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-center">
                  <h1 className="display-6 fw-bold lh-1 mb-3 text-warning">Reviews</h1>
                </div>
                <SubHeaderCenter>What the GameR8-community thinks about {this.game.name}</SubHeaderCenter>
                {this.userId == 0 ? <SubHeaderCenter>Sign-in to rate reviews and write your own</SubHeaderCenter> : ""}
              </>
            ) }
            {this.reviews.map((review, i) => {
              let last = false;
              if (i == (this.reviews.length - 1)) {last = true};
              return (
                <ReviewHero 
                  key={review.review_id} 
                  user={review.username} 
                  date={review.date} 
                  title={review.title} 
                  details={review.details ? review.details : ""} 
                  rating={review.rating} 
                  last={last}
                  review_id={review.review_id}
                  reviewUser={review.user_id}
                  // @ts-ignore
                  loggedInUser={this.userId.id}
                >
                  {this.userId != 0 ? (
                      <ReviewHeroUpvotes upvote={() => this.upvoteReview(review.review_id)} downvote={() => this.downvoteReview(review.review_id)} rating={review.relevance ? review.relevance : 0} />
                    ) : (
                      ""
                  )}
                  <Modal id={"editReview" + review.review_id}>
                    <ModalHeader title={"Edit your review for: " + this.game.name} />
                    <ModalBody>
                      <ReviewInput type="text" value={review.title} name="Title" onChange={(event) => (review.title = event.currentTarget.value)}></ReviewInput>
                      <ReviewInputArea value={review.details} name="Write your review here.." onChange={(event) => (review.details = event.currentTarget.value)}></ReviewInputArea>
                      <FormRating rating={review.rating} onChange={(event) => (review.rating = event.currentTarget.value)}/>
                    </ModalBody>
                    <ModalFooter>
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => this.mounted()}>Cancel</button>
                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => this.editReview(review)}>Save changes</button>
                    </ModalFooter>
                  </Modal>
                  <Modal id={"deleteReview" + review.review_id}>
                    <ModalHeader title={"Are you sure you wan't to delete your review?"} />
                    <ModalBody>
                      This review will be permanently deleted and will no longer be displayed on GameR8.
                    </ModalBody>
                    <ModalFooter>
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => this.mounted()}>Cancel</button>
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => this.deleteReview(review.review_id)}>Delete review</button>
                    </ModalFooter>
                  </Modal>
                </ReviewHero>
              );
            })}
          </ReviewList>
          <hr />
          {/* Similar Games */}
          <SimilarGames>
            <CardGroup>
              {this.similarGames.map((game) => {
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
          </SimilarGames>
        </Container>
      );
    } else {
      return (
        <Container>
          <Loading text="Loading game..." />
        </Container>
      );
    }
  }

  mounted() {
    this.getGame();
    this.review.game_id = this.props.match.params.id;
  }
  
  getGame() {
    igdbService
      .getGame(this.props.match.params.id)
      .then((response) => (this.game = response))
      .then(() => this.getReviews())
      .then(() => this.getAvgRating())
      .then(() => this.getSimilarGames())
      .then(() => this.auth())
      .then(() => this.loaded = true)
      .then(() => this.render());
  }

  getReviews() {
    reviewService.getGameReviews(this.props.match.params.id)
      .then((response) => (this.reviews = response))
  }
  
  getAvgRating() {
    reviewService.getAvgRating(this.props.match.params.id)
      .then((response) => (this.avgRating = response));
  }

  getSimilarGames() {
    igdbService
      .getSimilarGames(this.game.id)
      .then((response) => this.similarGames = response.slice(0,8));
  }

  auth() {
    loginService
    .auth()
    .then((response) => (this.userId = response))
    .catch((error) => {
      // console.error("Not authorized!")
    })
    .then(() => this.getUser());
  }

  getUser() {
    loginService
      .getUser(this.userId)
      .then((response) => (this.user = response))
      .then(() => this.review.user_id = this.user.user_id)
      .then(() => this.checkForGame());
  }
  
  checkForGame() {
    reviewService.checkForGame(this.userId, this.game.id)
      .then((response) => {
        if (response.length > 0) { 
          this.inCollection = true 
        } else {
          this.inCollection = false
        }
      });
  }
  
  submitReview() {
    if (this.game.cover) {
      this.game.cover.url = this.game.cover.url.replace("thumb", "cover_big");
    }
    else {
      this.game.cover = {id: 0, url: "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"}
    } 
    reviewService
    .saveGame(this.game)
    .then((response) => console.log(response))
    .then(() => {
      if (!this.inCollection) {
        this.saveUserGame()
      }
    })
    .then(() => this.postReview());

  }

  saveGame() {
    if (this.game.cover) {
      this.game.cover.url = this.game.cover.url.replace("thumb", "cover_big");
    }
    else {
      this.game.cover = {id: 0, url: "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"}
    } 
    reviewService.saveGame(this.game)
      .then((response) => console.log(response))
      .then(() => console.log(this.game))
      .then(() => this.saveUserGame());
      
  }

  saveUserGame() {
    reviewService.saveUserGame(this.userId, this.game.id)
      .then((response) => console.log(response))
      .then(() => this.mounted())
      .then(() => Alert.success("Added to collection!"));
  }

  removeUserGame() {
    reviewService.removeUserGame(this.userId, this.game.id)
    .then((response) => console.log(response))
    .then(() => this.mounted())
    .then(() => Alert.danger("Removed from collection!"));
  }

  postReview() {
    reviewService.postReview(this.review)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }

  editReview(review: Review) {
    reviewService.editReview(review)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }

  deleteReview(review_id: number) {
    reviewService.deleteReview(review_id)
    .then((response) => console.log(response))
    .then(() => this.loaded = false)
    .then(() => this.render())
    .then(() => this.mounted())
  }

  upvoteReview(review_id: number) {
    reviewService.upvoteReview(review_id)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }

  downvoteReview(review_id: number) {
    reviewService.downvoteReview(review_id)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }
}