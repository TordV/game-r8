import * as React from "react";
import { Component } from "react-simplified";
import { Container, Loading, Navigate, FormSelect, ReviewHeroLogo, ReviewHeroUpvotes, SubHeaderCenter } from "./widgets";
import { loginService, reviewService, Review } from "./services";

export class Reviews extends Component {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  sortValue: string = "Newest reviews";
  genres = [];
  filterGenre: number = 0;
  userId: number = 0;
  loaded: boolean = false;

  render() {
    if (this.loaded == true) {
      return (
        <Container>
          <h1 className="display-6 fw-bold lh-1 my-3 text-warning mx-auto">Reviews</h1>
          <SubHeaderCenter>Every review from the GameR8 community</SubHeaderCenter> 
          {this.userId == 0 ? <SubHeaderCenter>Sign-in to rate reviews and write your own</SubHeaderCenter> : ""}
          <hr />
          <div className="input-group justify-content-center">
            <FormSelect
              size="md" value={this.sortValue} onChange={(event) => {
                this.sortValue = event.currentTarget.value;
                this.mounted();
              }}
            >
              <option key={0}>Newest reviews</option>
              <option key={1}>Review score</option>
              <option key={2}>Top rated</option>
              <option key={3}>Lowest rated</option>
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
          <hr />
          {this.filteredReviews.length > 0 ? (
            <>
              {this.filteredReviews.map((review, i) => {
                let last = false;
                if (i == (this.reviews.length - 1)) {last = true};
                return (
                  <ReviewHeroLogo key={review.review_id} cover={review.cover} game_id={review.game_id} user={review.username} date={review.date} game_title={review.game_title} title={review.title} details={review.details} rating={review.rating} last={last}>
                    {this.userId != 0 ? (
                      <ReviewHeroUpvotes upvote={() => this.upvoteReview(review.review_id)} downvote={() => this.downvoteReview(review.review_id)} rating={review.relevance ? review.relevance : 0} />
                    ) : (
                      ""
                    )}
                  </ReviewHeroLogo>
                );
              })}
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
          <Loading text="Loading reviews..." />
        </Container>
      );
    }
  }

  mounted() {
    reviewService
      .getAllReviews()
      .then((response) => (this.reviews = response))
      .then(() => {
        this.reviews.map((review) => {
          review.genres = JSON.parse(review.genres)
          // @ts-ignore
          review.genres.map((genre) => {
            const existing = this.genres.map((i: any) => i.id);
            if (!existing.includes(genre.id)) {
              // @ts-ignore
              this.genres.push(genre);
            }
          });
        })
      })
      .then(() => this.filterReviews(this.filterGenre))
      .then(() => this.sortReviews(this.sortValue))
      .then(() => this.auth())
      .then(() => this.loaded = true)
      .then(() => this.render());
  }

  filterReviews(filterGenre: number) {
    if (filterGenre == 0) {
      this.filteredReviews = this.reviews;
    } else {
      this.filteredReviews = this.reviews.filter((review) => {
        const gameGenres: Number[] = [];
        // @ts-ignore
        review.genres.map(genre => gameGenres.push(genre.id));
        return gameGenres.includes(filterGenre);
      })
    }
  }

  sortReviews(sortValue: string) {
    if (sortValue == "Newest reviews") {
      this.filteredReviews.sort((a: any, b: any) => {
        if (a.review_id < b.review_id) return 1;
        if (a.review_id > b.review_id) return -1;
        return 0;
      });
    }
    else if (sortValue == "Review score") {
      this.filteredReviews.sort((a: any, b: any) => {
        if (a.relevance < b.relevance) return 1;
        if (a.relevance > b.relevance) return -1;
        return 0;
      });
    }
    else if (sortValue == "Top rated") {
      this.filteredReviews.sort((a: any, b: any) => {
        if (a.rating < b.rating) return 1;
        if (a.rating > b.rating) return -1;
        return 0;
      });
    }
    else if (sortValue == "Lowest rated") {
      this.filteredReviews.sort((a: any, b: any) => {
        if (a.rating > b.rating) return 1;
        if (a.rating < b.rating) return -1;
        return 0;
      });
    } else {
      console.log("Error with sort value.")
    }
  }

  auth() {
    loginService
    .auth()
    .then((response) => (this.userId = response))
    .catch((error) => {
      // console.error("Not authorized!")
    })
  }

  upvoteReview(review_id: number) {
    reviewService
      .upvoteReview(review_id)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }

  downvoteReview(review_id: number) {
    reviewService
      .downvoteReview(review_id)
      .then((response) => console.log(response))
      .then(() => this.mounted());
  }
}
