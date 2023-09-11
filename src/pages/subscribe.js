import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import { authStates, withAuth } from "../components/auth";
import { signOut } from "../utils/firebase";


import Firebase from "firebase";
import { FaBars, FaTimes } from 'react-icons/fa';

import bannerimg from '../assets/blue-bridge-logo-main.png';



class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        redirectToLogin: false,
        redirectToLoginn: false,
        redirectToLoginnn: false,
        showMobileMenu: false,
        isMobile: false,
        imageData: [],
        currentImageIndices: {},
        isActive: false,
        isPostRequestVisible: false,
        isReviewOffersVisible: false,
        isGetItDoneVisible: false
    };
  };


  

  handleLogin = () => {
    this.setState({ redirectToLoginn: true });
  }
  handleLogin = () => {
    this.setState({ redirectToLoginnn: true });
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

  handleResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  handleMediaQuery = (event) => {
    this.setState({ isMobile: event.matches });
  }

  componentDidMount() {
    // Set the value once initially
    this.handleResize();

    // Add event listener
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);

    // Set up media query listener
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.handleMediaQuery);
    // Trigger once on mount
    this.handleMediaQuery(this.mql);

    const db = Firebase.database().ref("images");
    db.on("value", snapshot => {
      let imageData = [];
      snapshot.forEach(snap => {
        // add an id field with the key of the snapshot
        let image = snap.val();
        image.id = snap.key;
        imageData.push(image);
      });
      this.setState({ imageData });

      // Initialize currentImageIndices
      let currentImageIndices = {};
      imageData.forEach((post, postIndex) => {
        currentImageIndices[postIndex] = 0;
      });
      this.setState({ currentImageIndices });

      console.log(imageData);
      console.log(currentImageIndices);
    });
}
  
componentWillUnmount() {
  // Remove event listener on cleanup
  window.removeEventListener('resize', this.handleResize);
  // Remove media query listener
  this.mql && this.mql.removeListener(this.handleMediaQuery);
  window.removeEventListener('scroll', this.handleScroll);
}

toggleMobileMenu = () => {
  this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
};

  render() {
    const { isMobile, showMobileMenu } = this.state;
    if (this.state.redirectToLogin) {
        return <Redirect to="/" />;
      }
    if (this.state.redirectToLoginn) {
        return <Redirect to="/login" />;
    }
    if (this.state.redirectToLoginnn) {
        return <Redirect to="/subscribe" />;
    }

    return (
      <div className="containerrr">
        <div className="navbar">
          <div className="padding80">
            <img onClick={() => this.props.history.push('/')} style={{width: 120, borderRadius: 20, cursor: "pointer"}} src={bannerimg} alt="description" />
            {isMobile && (
                <>
                  <button className="menu-button" onClick={this.toggleMobileMenu}>
                    {showMobileMenu ? <FaTimes /> : <FaBars />}
                  </button>
                  <div className={`mobile-menu ${showMobileMenu ? 'open' : ''}`}>
                    <button className="buttonsidebarback" onClick={this.toggleMobileMenu}>&lt;</button>
                    <button className="buttonsidebar" onClick={this.handleLogin}> Log In </button>
                    {this.props.authState === authStates.LOGGED_IN && (
                      <button onClick={() => this.props.history.push('/upload')} className="buttonsidebar"> Upload </button>
                    )}
                  </div>
                </>
              )}
              {!isMobile && (
                <div className="navbar-items">
                  <button onClick={() => this.props.history.push('/profile')} className="marginside40 ">Profile </button>
                  <button onClick={() => this.props.history.push('/experts')} className="marginside40 ">Experts </button>
                  <button onClick={() => this.props.history.push('/requests')} className="marginside40 ">Requests </button>
                  <button className="marginside40 ">About </button>
                  {this.props.authState === authStates.LOGGED_IN && (
                    <button onClick={() => this.props.history.push('/upload')} className="post buttonsidebar marginside40"> Post a request </button>
                  )}
                  {this.props.authState === authStates.LOGGED_IN && (
                    <button onClick={() => this.props.history.push('/uploadlist')} className="list buttonsidebar marginside40 "> List a service </button>
                  )}
                </div>
              )}
          </div>
        </div>

        <div className="homepageee">
            <div style={{marginTop: 10, display: "flex", borderRadius: 20, width: "100%", backgroundColor: "#fff", padding: 20}}>
            <div style={{width: "100%", borderRadius: 20}}
              dangerouslySetInnerHTML={{
                __html: `
                <stripe-pricing-table pricing-table-id="prctbl_1NosKWFkBFBAJ31EfYeyeBTS"
                publishable-key="pk_test_51Ngx5MFkBFBAJ31EhQzPjg9ary1WmbSc32qJHcNb5UKXZChcbyq1sgPE3e5v18Ai9Z9LC7djfeJGPhzIRvy5uTQZ00amXrWl42">
                </stripe-pricing-table>
                `
              }}
            />
            </div>
        </div>


       

        
      </div>
    );
  }
   
}

export default withRouter(withAuth(Home));

