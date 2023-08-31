import React from "react";
import { Redirect, withRouter, Link } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Firebase from "firebase";
import { signOut } from "../utils/firebase";
import { FaBars, FaTimes } from 'react-icons/fa';

import DUMMY_IMAGE_URL from "../assets/manwithlaptop.png";
import plane from '../assets/banner.png';

function handleSignOut() {
  signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch(e => {
      console.log("Error signing out", e);
    });
}



class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMobileMenu: false,
      isMobile: false,
      imageData: [],
      currentImageIndices: {},
      redirectToLogin: false,
    };
  }

  handleLogin = () => {
    this.setState({ redirectToLogin: true });
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


  handleImageScroll = (postIndex, direction) => {
    this.setState(prevState => {
      let currentImageIndices = {...prevState.currentImageIndices};
      let maxIndex = this.state.imageData[postIndex].imageURLs.length - 1;
      let currentImageIndex = currentImageIndices[postIndex] || 0;
  
      currentImageIndex += direction;
  
      if (currentImageIndex < 0) {
        currentImageIndex = maxIndex;
      } else if (currentImageIndex > maxIndex) {
        currentImageIndex = 0;
      }
  
      currentImageIndices[postIndex] = currentImageIndex;
  
      return {currentImageIndices};
    });
  }
  

  componentWillUnmount() {
    // Remove event listener on cleanup
    window.removeEventListener('resize', this.handleResize);
    // Remove media query listener
    this.mql && this.mql.removeListener(this.handleMediaQuery);
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
  };

  render() {
    const { isMobile, showMobileMenu } = this.state;
    //const { imageData } = this.state;
    if (this.state.redirectToLogin) {
      return <Redirect to="/profile" />;
    }


    return (
      <div className="containerr">
        <div className="navbar">
          <div className="padding80">
            <p onClick={() => this.props.history.push('/experts')}>BlueBridge.nl</p>
            {isMobile && (
                <>
                  <button className="menu-button" onClick={this.toggleMobileMenu}>
                    {showMobileMenu ? <FaTimes /> : <FaBars />}
                  </button>
                  <div className={`mobile-menu ${showMobileMenu ? 'open' : ''}`}>
                    <button className="buttonsidebarback" onClick={this.toggleMobileMenu}>&lt;</button>
                    <button className="buttonsidebar" onClick={handleSignOut}> Sign Out </button>
                    <button className="buttonsidebar" onClick={this.handleLogin}> Log In </button>
                    {this.props.authState === authStates.LOGGED_IN && (
                      <button onClick={() => this.props.history.push('/upload')} className="buttonsidebar"> Upload </button>
                    )}
                  </div>
                </>
              )}
              {!isMobile && (
                <div className="navbar-items">
                  <button onClick={this.handleLogin} className="marginside40 ">Profile </button>
                  <button onClick={() => this.props.history.push('/experts')} className="marginside40 ">Experts </button>
                  <button className="marginside40 ">Requests </button>
                  <button className="marginside40 ">About </button>
                  {this.props.authState === authStates.LOGGED_IN && (
                    <button onClick={() => this.props.history.push('/upload')} className="post buttonsidebar marginside40"> Post a request </button>
                  )}
                  {this.props.authState === authStates.LOGGED_IN && (
                    <button onClick={() => this.props.history.push('/upload')} className="list buttonsidebar marginside40 "> List a service </button>
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="homepage">
          <div className="homepageinside">
            <h3>Find an expert for <br />any kind of task</h3>
            <img className="img border-radius" src={plane} alt="description" />
          </div>
          <div className="homepageinsidesectwo">
            <div className="sectwocards">
              <img className="imgcard" src={DUMMY_IMAGE_URL} alt="description" />
              <p className="justified">Maecenas varius porttitor ipsum consequat
              vivamus urna lacus viverra a sed eget.</p>
              <Link className="linkk" to="/signup">Post a request</Link>
            </div>
            <div className="sectwocards">
              <img className="imgcard" src={DUMMY_IMAGE_URL} alt="description" />
              <p className="justified">Maecenas varius porttitor ipsum consequat
              vivamus urna lacus viverra a sed eget.</p>
              <Link className="linkk" to="/signup">List a service</Link>
            </div>
          </div>
          <div style={{marginTop: 30, flexDirection: "column", display: "flex", alignItems: "center", textAlign: "justify"}}>
            <h3>About us</h3>
            <h2>Maecenas varius porttitor ipsum consequat
              vivamus urna lacus viverra a sed eget.Maecenas varius porttitor ipsum consequat
              vivamus urna lacus viverra a sed eget.</h2>
              <Link className="linkk" to="/signup">Read more</Link>
          </div>
          <div style={{height: 100, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <p>&copy;BlueBridge All Rights Resevred. </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withAuth(Home));
