import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import { withAuth } from "../components/auth";
import { signOut } from "../utils/firebase";



class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        redirectToLogin: false,
        redirectToLoginn: false,
    };
  };

  handleLogin = () => {
    this.setState({ redirectToLoginn: true });
  }

    handleSignOut = () => {
    signOut()
      .then(() => {
        console.log("Signed Out");
        this.setState({ redirectToLogin: true });
      })
      .catch(e => {
        console.log("Error signing out", e);
      });
  }
  

  render() {
    if (this.state.redirectToLogin) {
        return <Redirect to="/" />;
      }
    if (this.state.redirectToLoginn) {
        return <Redirect to="/login" />;
    }

    return (
      <div className="container">
        <div className="uploadscreen">
            <div className="uploadform">
            <button onClick={this.handleSignOut} className="linkk ">Sign out </button>
            <button onClick={this.handleLogin} className="linkk ">Log in </button>
            </div>
        </div>
      </div>
    );
  }
   
}

export default withRouter(withAuth(Home));

