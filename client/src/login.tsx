import * as React from "react";
import { Component } from "react-simplified";
import { Error, Container, SignIn, SignInInput, SignInButton, SubHeader, LoggedOutScreen} from "./widgets";
import { registerService, loginService } from "./services";
import { createHashHistory } from "history";

// requite module to validate passwords when registering
const passwordValidator = require("password-validator");
var schema = new passwordValidator();
schema.is().min(8) // passwords must be atleast 8 characters long
  .has().digits() // passwords must include atleast one digit
  .has().lowercase() // passwords must include atleast one lowercase letter
  .has().uppercase() // passwords must include atleast one uppercase letter
  .has().symbols(); // passwords must include atleast one symbol

const history = createHashHistory();

export class Login extends Component {
  username: string = "";
  password: string = "";
  userId: number = 0;
  loginError: boolean = false;

  render() {
    return (
      <Container>
        <SignIn text="Please sign in" logo="https://i.imgur.com/fkmQTyl.png">
          <SignInInput
            type="text"
            value={this.username}
            onChange={(event) => (this.username = event.currentTarget.value)}
            required={true}
            name="Username"
          />
          <SignInInput
            type="password"
            value={this.password}
            onChange={(event) => (this.password = event.currentTarget.value)}
            required={true}
            name="Password"
          />
          <SignInButton
            btnType="primary"
            btnSize="lg"
            onClick={() => {
              loginService
                .login(this.username, this.password)
                .then(() => history.push("/"))
                .then(() => this.reload())
                .catch(() => {
                  this.loginError = true;
                  this.render()
                });
            }}
          >
            Sign in
          </SignInButton>
          <hr></hr>
          <SignInButton
            btnType="outline-light"
            btnSize="md"
            onClick={() => {
              history.push("/register");
            }}
          >
            Or Create a New Account
          </SignInButton>
          {this.loginError ? <Error title="Failed to log in!" text="Username or password is incorrect" type="warning" /> : ""}
        </SignIn>
      </Container>
    );
  }

  mounted() {
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => {if(this.userId != 0) {history.push('/')}})
      .catch(() => {
        this.render();
      });
  }

  reload() {
    window.location.reload();
  }
}

export class Register extends Component {
  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  userId: number = 0;
  registerError: boolean = false;
  registerError2: boolean = false;
  registerError3: boolean = false;
  missing: string = "";

  render() {
    return (
      <Container>
        <SignIn text="Please register" logo="https://i.imgur.com/rCvxIhW.png">
          <SignInInput
            type="text"
            value={this.username}
            onChange={(event) => (this.username = event.currentTarget.value)}
            required={true}
            name="Username"
          />
          <SignInInput
            type="password"
            value={this.password}
            onChange={(event) => (this.password = event.currentTarget.value)}
            required={true}
            name="Password"
          />
          <SignInInput
            type="password"
            value={this.confirmPassword}
            onChange={(event) =>
              (this.confirmPassword = event.currentTarget.value)
            }
            required={true}
            name="Re-enter password"
          />
          <SignInButton
            btnType="warning"
            btnSize="lg"
            onClick={() => {
              if (this.password == this.confirmPassword) {
                if (schema.validate(this.password)) {
                  registerService
                    .register(this.username, this.password)
                    .then(() => history.push("/login"))
                    .catch((error) => {
                      this.registerError3 = true;
                      this.render()
                    });
                } else {
                  let missing = schema.validate(this.password, { list: true });
                  
                  missing.map((req: string, i: number) => {
                    this.missing += req;
                    if (i != missing.length - 1) { this.missing += ", "}
                    this.registerError2 = true;
                    this.render();
                  });
                }
              } else {
                this.registerError = true;
                this.render();
              }
            }}
          >
            Register
          </SignInButton>
          <br />
          <SubHeader>
            Passwords should:
            <ul>
              <li>Have a minimum length of 8 characters</li>
              <li>
                Include atleast one character of each of the following:
                lower-case letter, upper-case letter, digit & symbol
              </li>
            </ul>
          </SubHeader>
          <hr></hr>
          <SignInButton
            btnType="outline-light"
            btnSize="md"
            onClick={() => {
              history.push("/login");
            }}
          >
            Already registered? Sign-in
          </SignInButton>
          {this.registerError ? <Error title="Failed to register!" text="Passwords doesn't match." type="warning" /> : ""}
          {this.registerError2 ? <Error title="Failed to register!" text={"Missing: " + this.missing} type="warning" /> : ""}
          {this.registerError3 ? <Error title="Failed to register!" text="Unknown error, please try again." type="warning" /> : ""}
        </SignIn>
      </Container>
    );
  }

  mounted() {
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => {if(this.userId != 0) {history.push('/')}});
  }
}

export class LoggedOut extends Component {
  userId: number = 0;

  render() {
    return (
      <Container>
        <LoggedOutScreen />
      </Container>
    );
  }

  mounted() {
    loginService
      .auth()
      .then((response) => (this.userId = response))
      .then(() => {if(this.userId != 0) {history.push('/')}});
  }
}
