import React from "react";
import { Link, Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import en from "../utils/i18n";
import { createNewUser } from "../utils/firebase";
import Loader from "../components/loader";
import { validateEmailPassword } from "../utils/helpers";

import plane from "../assets/blue-bridge-logo.png";

import "../styles/login.css";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      retype: "",
      error: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  componentDidMount() {
    // Set the value once initially
    this.handleResize();

    // Add event listener
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // Remove event listener on cleanup
    window.removeEventListener('resize', this.handleResize);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: "",
    });

    //Verify that password fields match
    if (target.type === "password") {
      this.setState(function(state) {
        if (state.password !== state.retype) {
          return {
            error: en.ERRORS.PASSWORD_MISMATCH,
          };
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.error) {
      return;
    }

    //Validate email & password
    const errorMsg = validateEmailPassword(
      this.state.email,
      this.state.password
    );

    if (errorMsg) {
      this.setState({
        error: errorMsg,
      });
      return;
    }

    createNewUser(this.state.email, this.state.password)
      .then(() => {
        console.log("Signed Up!");
      })
      .catch(e => {
        console.log("Error signing up", e);
        if (e.code === "auth/email-already-in-use") {
          this.setState({
            error: "Email already in use",
          });
        }
      });
  }

  render() {
    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_IN) {
      return <Redirect to="/"></Redirect>;
    }

    const errorMsg = this.state.error;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="welcomecard">
            <img style={{width: 300, borderRadius: 150}} src={plane} alt="description" />
          </div>

          <div className="inputfield">
            <h2 className="colorwhite">{en.GREETINGS.SIGNUP}</h2>

            <input
              type="text"
              placeholder={en.FORM_FIELDS.EMAIL}
              name="email"
              onChange={this.handleInputChange}
              required
            />

            <input
              type="password"
              placeholder={en.FORM_FIELDS.PASSWORD}
              name="password"
              onChange={this.handleInputChange}
              required
            />

            <input
              type="password"
              placeholder={en.FORM_FIELDS.RETYPE_PASSWORD}
              name="retype"
              onChange={this.handleInputChange}
              required
            />

            {errorMsg && <p className="error">Error: {errorMsg}</p>}
            <button type="submit">Signup</button>

            <p>Already a member?</p>
            <Link className="link" to="/login">Login</Link>  
          </div>
        </div>
      </form>
    );
  }
}

export default withAuth(SignUp);
