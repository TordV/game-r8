// Reusable widgets/components used in the other files
import * as React from "react";
import { ReactNode, ChangeEvent } from "react";
import { Component } from "react-simplified";
import { NavLink } from "react-router-dom";

// Main container around all pages, takes no attributes
export class Container extends Component {
  render() {
    return <div className="container d-flex flex-column min-vh-100">{this.props.children}</div>;
  }
}

// A cardgroup-component for game cards, takes no attributes
export class CardGroup extends Component {
  render() {
    return (
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {this.props.children}
      </div>
    );
  }
}

// A gamecard of set size with image and footer with game title, takes name of game and url to cover as attributes
export class GameCard extends Component<{
  name: string;
  url?: string;
}> {
  render() {
    return (
      <div className="card bg-dark h-100 text-body">
        <img src={this.props.url ? this.props.url : "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"} className="d-block w-100" alt="..."/>
        <div style={{ background: "#191919" }} className="card-footer text-white">
          <h4>{this.props.name}</h4>
        </div>
      </div>
    );
  }
}

// the footer of the web page, static and takes no attributes
export class PageFooter extends Component {
  render() {
    return (
      <footer style={{ background: "#191919" }} className="footer mt-auto py-3">
        <div className="container d-flex justify-content-center">
          <span className="text-muted">Made by students @ NTNU Trondheim.</span>
        </div>
      </footer>
    );
  }
}

// A subheader, muted text that is left-aligned
export class SubHeader extends Component {
  render() {
    return <h6 className="card-subtitle text-muted mt-1">{this.props.children}</h6>;
  }
}

// A centered header, muted text that is center-aligned
export class SubHeaderCenter extends Component {
  render() {
    return <div className="d-flex justify-content-center text-muted">{this.props.children}</div>;
  }
}

// A navigation-class, for buttons and menus that go to another page. NavBar.link but with a new name. Takes the destination as an attribute
export class Navigate extends Component<{
  to: string;
}> {
  render() {
    return (
      <NavLink className="nav-link px-2 text-white" activeClassName="active" to={this.props.to} exact>
        {this.props.children}
      </NavLink>
    );
  }
}

// The page header. Takes the current search value, onchange, onkeyup and onclick functions of the search bar. Also takes an attribute for wether a user is logged in, and a function for logging out
export class Header extends Component<{
  searchValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
  loggedIn: boolean;
  logout: () => void;
}> {
  render() {
    return (
      <header style={{ background: "#191919" }} className="p-3 text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/" className="d-flex align-items-center mb-4 mb-lg-1 text-white text-decoration-none">
              <img src="https://i.imgur.com/rCvxIhW.png" className="img-fluid" alt="GameR8" width={90} />
            </a>
            <form action="" className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 ms-4">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control form-control-sm bg-white text-dark"
                  placeholder="Search for games.."
                  aria-label="Search"
                  value={this.props.searchValue}
                  onChange={this.props.onChange}
                  onKeyUp={this.props.onKeyUp}
                />
                <button type="submit" className="input-group-text btn-default" onClick={this.props.onClick}><i className="fa fa-search"></i></button>
              </div>
            </form>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              {this.props.children}
            </ul>
            <div className="text-end">
              {this.props.loggedIn ? (
                <button type="button" className="btn btn-outline-danger" onClick={this.props.logout}>Logout <i className="fa fa-sign-out"></i></button>
              ) : (
                <Navigate to="/login">
                  <button type="button" className="btn btn-primary"><i className="fa fa-sign-in"></i> Sign-in</button>
                </Navigate>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

// A select box, takes the current value and onchange-function, as well as the size as attributes 
export class FormSelect extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  size: string;
}> {
  render() {
    return (
      <div className="col-md-2 py-3">
        <select
          className={"form-select form-select-" + this.props.size + " bg-dark text-white"}
          value={this.props.value}
          onChange={this.props.onChange}
        >{this.props.children}
        </select>
      </div>
    );
  }
}

// A slide-bar input for rating games, takes the rating and onchange function as attributes
export class FormRating extends Component<{
  rating: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> {
  render() {
    return (
      <>
        <label htmlFor="rating" className="form-label">Your rating: {this.props.rating}</label>
        <input type="range" className="form-range" min="0" max="5" id="rating" value={this.props.rating} onChange={this.props.onChange}/>
      </>
    );
  }
}

// Alerts that pop up at the top of the page and automatically closes, from Ole Christian Eidheims' files
export class Alert extends Component {
  alerts: { id: number; text: ReactNode; type: string }[] = [];
  nextId: number = 0;

  render() {
    return (
      <div>
        {this.alerts.map((alert, i) => {
          setTimeout(() => {
            this.alerts.splice(i, 1);
          }, 3000);
          return (
            <div
              key={alert.id}
              className={"alert alert-dismissible alert-" + alert.type}
              role="alert"
            >
              {alert.text}
              <button
                type="button"
                className="btn-close btn-sm"
                onClick={() => this.alerts.splice(i, 1)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  static success(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance)
        instance.alerts.push({
          id: instance.nextId++,
          text: text,
          type: "success",
        });
    });
  }

  static info(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance)
        instance.alerts.push({
          id: instance.nextId++,
          text: text,
          type: "info",
        });
    });
  }

  static warning(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance)
        instance.alerts.push({
          id: instance.nextId++,
          text: text,
          type: "warning",
        });
    });
  }

  static danger(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance)
        instance.alerts.push({
          id: instance.nextId++,
          text: text,
          type: "danger",
        });
    });
  }
}

// A carousel-widget for the fron page slideshows. Takes the id of the slide show as an attribute
export class Carousel extends Component<{
  id: string;
}> {
  render() {
    return (
      <div id={this.props.id} className="carousel slide w-100 ms-auto me-auto start-0" data-bs-ride="carousel">
        <div className="carousel-inner">
          {this.props.children}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={"#" + this.props.id} data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={"#" + this.props.id} data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  }
}

// Widget for the sign-in (and sign-up) form, takes a logo and text as attributes
export class SignIn extends Component<{ 
  text: string; 
  logo: string 
}> {
  render() {
    return (
      <main className="form-signin w-25 ms-auto my-3 me-auto start-0">
        <form>
          <div className="d-flex flex-column bd-highlight mb-3">
            <div className="d-flex justify-content-center">
              <img className="mb-4" src={this.props.logo} alt="" width="160" />
            </div>
            <div className="d-flex justify-content-center">
              <h1 className="h3 mb-3 fw-normal">{this.props.text}</h1>
            </div>
          </div>
          <div className="d-grid gap-2">{this.props.children}</div>
        </form>
      </main>
    );
  }
}

// Input-box for signin and signup, takes type, value, onchange function, required boolean and name as attributes
export class SignInInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
}> {
  render() {
    return (
      <div className="form-floating">
        <input
          className="form-control bg-dark text-white"
          id={"floating" + this.props.name}
          type={this.props.type}
          value={this.props.value}
          onChange={this.props.onChange}
          required={this.props.required}
          placeholder={this.props.name}
        />
        <label htmlFor={"floating" + this.props.name}>{this.props.name}</label>
      </div>
    );
  }
}

// Buttons for signin and signup, takes the onclick function and button types and sizes as attributes
export class SignInButton extends Component<{
  onClick: () => void;
  btnType: string;
  btnSize: string;
}> {
  render() {
    return (
      <button className={"w-100 btn btn-" + this.props.btnSize + " btn-" + this.props.btnType} type="button" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

// Input-box for writing reviews, takes type, value, onchange function and name as attributes
export class ReviewInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
}> {
  render() {
    return (
      <div className="mb-3 bg-dark text-white">
        <div className="form-outline">
          <input
            className="form-control bg-dark text-white"
            maxLength={32}
            id={"floating" + this.props.name}
            type={this.props.type}
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder={this.props.name}
          />
        </div>
      </div>
    );
  }
}

// Input-area for writing reviews, takes value, onchange function and name as attributes
export class ReviewInputArea extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
}> {
  render() {
    return (
      <div className="mb-3 bg-dark text-white">
        <div className="form-outline">
          <textarea
            className="form-control bg-dark text-white"
            rows={8}
            maxLength={999}
            id={"floating" + this.props.name}
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder={this.props.name}
          />
        </div>
      </div>
    );
  }
}

// Class for modal (pop up box), takes the id of the modal as attribute
export class Modal extends Component<{
  id: string;
}> {
  render() {
    return (
      <div className="modal fade" id={this.props.id} aria-hidden="true">
        <div className="modal-dialog bg-dark text-white">
          <div className="modal-content bg-dark text-white">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

// Modal-header, takes a title as attribute
export class ModalHeader extends Component<{
  title: string;
}> {
  render() {
    return (
      <div className="modal-header bg-dark text-white">
        <h5 className="modal-title">{this.props.title}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
    );
  }
}

// Modal-body
export class ModalBody extends Component {
  render() {
    return (
      <div className="modal-body bg-dark text-white">
        {this.props.children}
      </div>
    );
  }
}

// Modal-footer
export class ModalFooter extends Component {
  render() {
    return (
      <div className="modal-footer">
        {this.props.children}
      </div>
    );
  }
}

// Game-hero, attributes for cover-url, name, and summary (of the game)
export class GameHero extends Component<{
  cover: string;
  name: string;
  summary: string;
}> {
  render() {
    return (
      <div className="container col-md-10 px-0 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-2">
          <div className="col-10 col-sm-8 col-lg-5">
            <img src={this.props.cover} className="d-block mx-lg-auto img-fluid" alt="Image loading.." width="700" height="" loading="lazy"></img>
          </div>              
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold lh-1 mb-3">{this.props.name}</h1>
            <p className="lead fs-5">{this.props.summary}</p>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

// Home-hero, attributes for name (of user), some text, and attributes for two buttons
export class HomeHero extends Component<{
  name: string;
  text: string;
  btnTo: string;
  btnTo2: string;
  btn: string;
  btn2: string;
  btnText: string;
  btnText2: string;
  btnLogo: string;
  btnLogo2: string;
}> {
  render() {
    return (
      <div className="container col-md-10 px-0 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-2">
          <div className="col-10 col-sm-8 col-lg-5">
            {this.props.children}
          </div>              
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold text-warning lh-1 mb-3">Welcome, {this.props.name}</h1>
            <p className="lead fs-5">{this.props.text}</p>
            <div className="d-grid d-md-flex justify-content-md-start">
              <Navigate to={this.props.btnTo}><button type="button" className={"btn btn-"+ this.props.btn +" btn-lg"}><i className={"fa fa-"+ this.props.btnLogo}></i> {this.props.btnText}</button></Navigate>
              <Navigate to={this.props.btnTo2}><button type="button" className={"btn btn-"+ this.props.btn2 +" btn-lg"}><i className={"fa fa-"+ this.props.btnLogo2}></i> {this.props.btnText2}</button></Navigate>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// The screen that is displayed when you logout
export class LoggedOutScreen extends Component {
  render() {
    return (
      <>
        <h1 className="display-6 fw-bold lh-1 my-3 text-warning mx-auto">Good bye!</h1>
        <h6 className=" d-flex justify-content-center text-secondary">Sad to see you go, soldier. Off to play some games?</h6>
        <div className="d-grid d-md-flex justify-content-center">
          <Navigate to="/login"><button type="button" className={"btn btn-primary btn-md"}><i className={"fa fa-sign-in"}></i> Sign-in again</button></Navigate>
          <Navigate to="/"><button type="button" className={"btn btn-outline-secondary btn-md"}><i className={"fa fa-home"}></i> Go to home</button></Navigate>
        </div>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngplay.com%2Fwp-content%2Fuploads%2F6%2FGame-Over-Yellow-Transparent-PNG.png&f=1&nofb=1" className="mx-auto img-fluid mt-4" alt="Good bye!" width="350" height="" loading="lazy" />
      </>
    );
  }
}

// Review-hero without logo, attributes for user(name), date, title, details, rating, review_id, reviewuser (id), and wether a user is logged in. 
export class ReviewHero extends Component<{
  user: any;
  date: string;
  title: string;
  details: string;
  rating: string;
  last?: boolean;
  review_id: number;
  reviewUser: number;
  loggedInUser: number;
}> {
  render() {
    return (
      <div>
        <div className="container col-md-10 px-0 py-4">
          <div className="row flex-lg-row align-items-center g-5 pb-2">
            <div className="col-lg-10">
              <div className="display-6 fw-bold lh-1 mb-1">{this.props.title}</div>
              <p className="lead fs-5"><i className="fa fa-star"></i> Rated {this.props.rating} / 5</p>
              <p className="lead fs-5">{this.props.details ? this.props.details : <SubHeader>No details.</SubHeader>}</p>
              <figcaption className="blockquote-footer mt-0">Written by <cite title="Source Title">{this.props.user}</cite> on {this.props.date}</figcaption>
              {/* @ts-ignore */}
              {this.props.reviewUser == this.props.loggedInUser ? (
                <>
                  <button type="button" data-bs-toggle="modal" data-bs-target={"#editReview" + this.props.review_id} data-bs-whatever="@mdo" className="btn btn-light btn-md px-2 ms-auto mx-2"><i className="fa fa-edit"></i> Edit review</button>
                  <button type="button" data-bs-toggle="modal" data-bs-target={"#deleteReview" + this.props.review_id} data-bs-whatever="@mdo" className="btn btn-outline-danger btn-md px-2 mx-2"><i className="fa fa-trash"></i> Delete review</button>
                </>
              ) : ("")}
            </div>
            <div className="col-lg-2">
              {this.props.children}
            </div>
          </div>
        </div>
        {!this.props.last ? (
          <hr />
        ) : ""}
      </div>
    );
  }
}

// review-hero with logo, attributes for cover-url, game_id, user(name), date, game_title, title, details, and rating. 
export class ReviewHeroLogo extends Component<{
  cover: string;
  game_id: number;
  user: any;
  date: string;
  game_title: string;
  title: string;
  details: string;
  rating: string;
  last?: boolean;
}> {
  render() {
    return (
      <div>
        <div className="container col-md-10 px-0 py-5">
          <div className="row flex-lg-row align-items-center g-5 py-2">
            <div className="col-10 col-sm-8 col-lg-3">
              <Navigate to={"/games/" + this.props.game_id}>
                <img src={this.props.cover ? this.props.cover : "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"} className="d-block mx-lg-auto img-fluid" alt="Image loading.." width="700" height="" loading="lazy"></img>
              </Navigate>
            </div>
            <div className="col-lg-7">
              <div className="display-6 fw-bold lh-1 mb-1">{this.props.title}</div>
              <p className="lead fs-5"><i className="fa fa-star"></i> Rated {this.props.rating} / 5</p>
              <p className="lead fs-5">{this.props.details ? this.props.details : <SubHeader>No details.</SubHeader>}</p>
              <figcaption className="blockquote-footer mt-0">Written by <cite title="Source Title">{this.props.user}</cite> on {this.props.date} for <cite title="Source Title">{this.props.game_title}</cite>"</figcaption>
            </div>
            <div className="col-lg-2">
              {this.props.children}
            </div>
          </div>
        </div>
        {!this.props.last ? (
          <hr />
        ) : ""}
      </div>
    );
  }
}

// Review-hero for the home screen, attributes for cover-url, game_id, user(name), date, game_title, title, details and rating
export class ReviewHeroHome extends Component<{
  cover: string;
  game_id: number;
  user: any;
  date: string;
  game_title: string;
  title: string;
  details: string;
  rating: string;
}> {
  render() {
    return (
      <div>
        <div className="container col-md-10 px-0 py-5">
          <div className="row flex-lg-row align-items-center g-5 py-2">
            <div className="col-10 col-sm-8 col-lg-3">
              <Navigate to={"/games/" + this.props.game_id}>
                <img src={this.props.cover ? this.props.cover : "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png"} className="d-block mx-lg-auto img-fluid" alt="Image loading.." width="700" height="" loading="lazy"></img>
              </Navigate>
            </div>
            <div className="col-lg-9">
              <div className="display-6 fw-bold lh-1 mb-1">{this.props.title}</div>
              <p className="lead fs-5"><i className="fa fa-star"></i> Rated {this.props.rating} / 5</p>
              <p className="lead fs-5">{this.props.details ? this.props.details : <SubHeader>No details.</SubHeader>}</p>
              <figcaption className="blockquote-footer mt-0">Written by <cite title="Source Title">{this.props.user}</cite> on {this.props.date} for <cite title="Source Title">{this.props.game_title}</cite>"</figcaption>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// hero-footer, a optional "notice"-attribute (used for game-hero)
export class HeroFooter extends Component <{
  notice?: string;
}> {
  render() {
    return (
      <>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          {this.props.children}
        </div>
        {this.props.notice ? (
          <>
            <hr />
            <SubHeader>{this.props.notice}</SubHeader>
          </>
        ) : (
          ""
        )}
      </>
    );
  }
}

// upvote/downvote-sidebar for review-heroes, attributes for upvote-function, downvote-function and rating (relevance)
export class ReviewHeroUpvotes extends Component <{
  upvote: () => void;
  downvote: () => void;
  rating: number;
}> {
  render() {
    return (
      <>
        <div className="d-flex flex-column bd-highlight mb-3 justify-content-center">
          <a role="button" className="link-warning px-2 py-0 my-2 mx-auto" onClick={this.props.upvote}>
            <i className="fa fa-chevron-up fa-2x"></i>
          </a>
          <span className="text-light mx-auto">{this.props.rating}</span>
          <a role="button" className="link-secondary px-2 py-0 my-2 mx-auto" onClick={this.props.downvote}>
            <i className="fa fa-chevron-down fa-2x"></i>
          </a>
        </div>
      </>
    );
  }
}

// Gameinfo-widget that displays detailed information about game on game page, takes the game_title as attribute
export class GameInfo extends Component <{
  game_title: string;
}> {
  render() {
    return (
      <div className="container px-6 py-3" id="icon-grid">
        <div className="d-flex justify-content-center">
          <h1 className="display-6 fw-bold lh-1 mb-3 text-warning">Game details</h1>
        </div>
        <h6 className=" d-flex justify-content-center text-secondary">All you need to know about {this.props.game_title}</h6>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-6 py-3">
          {this.props.children}
        </div>
      </div>
    );
  }
}

// widget for each of the properties in the details, takes the property as attribute
export class GameInfoProp extends Component<{
  property: string;
}> {
  render() {
    return (
      <div className="col d-flex align-items-start">
        <svg className="bi text-muted flex-shrink-0 me-3" width="1.75em" height="1.75em"><use><i className="fa fa-plus bg-white"></i></use></svg>
        <div>
          <h4 className="fw-bold mb-0">{this.props.property}</h4>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// widget for the review-list on the game-page, takes the game_title as attribute
export class ReviewList extends Component <{
  game_title: string;
}> {
  render() {
    return (
      <div className="container px-4 py-3" id="reviewList">
        {this.props.children}
      </div>
    );
  }
}

// widget for the similar-games section on the game-page
export class SimilarGames extends Component {
  render() {
    return(
      <div className="container px-6 py-3" id="icon-grid">
        <div className="d-flex justify-content-center">
          <h1 className="display-6 fw-bold lh-1 mb-3 text-warning">Related games</h1>
        </div>
        <h6 className=" d-flex justify-content-center text-secondary">Similar games you might like</h6>
        {this.props.children}
      </div>
    );
  }
}

// alert-boxes that are displayed on set locations, takes title, text and type as attributes
export class Error extends Component <{
  title: string;
  text: string;
  type: string;
}> {
  render() {
    return(
      <div className={"alert alert-" + this.props.type + " alert-dismissible fade show"} role="alert">
        <strong>{this.props.title}</strong> {this.props.text}
        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
      </div>
    );
  }
}

// widget for the loading-screens displayed before page-loads, take the text displayed as attribute
export class Loading extends Component <{
  text: string;
}> {
  render() {
    return(
      <div className="d-flex flex-column my-4 justify-content-center">
        <div className="display-6 fw-bold lh-1 mb-4 mx-auto">{this.props.text}</div>
        <div className="spinner-border mx-auto" style={{"width": "5rem", "height": "5rem"}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
}