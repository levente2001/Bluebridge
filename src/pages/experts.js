import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Firebase from "firebase";
import { signOut } from "../utils/firebase";
import { FaBars, FaTimes } from 'react-icons/fa';

import DUMMY_IMAGE_URL from "../assets/dummy-post-horisontal.jpg";

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

  handleResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  handleLogin = () => {
    this.setState({ redirectToLogin: true });
  }

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
    const { imageData, currentImageIndices } = this.state;
    //const { imageData } = this.state;

    if (this.state.redirectToLogin) {
      return <Redirect to="/profile" />;
    }

    return (
      <div className="containerr">
        <div className="navbar">
        <div className="padding80">
            <p onClick={() => this.props.history.push('/')}>BlueBridge.nl</p>
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
        <div className="homepagee">
            <div className="itemslist">
              {imageData && imageData.map((post, postIndex) => (
                <div key={postIndex} className="card uploadscreen">
                  {post.imageURLs && post.imageURLs.length > 0 ? (
                    post.imageURLs.map((imageUrl, imgIndex) => (
                      <div key={imgIndex} style={{ borderRadius: "10px", alignItems: "center", justifyContent: "center", width: '100%', height: '100%', display: imgIndex === (currentImageIndices[postIndex] || 0) ? 'block' : 'none' }}>
                        <img onClick={() => this.props.history.push(`/productpage/${post.id}`)} src={imageUrl} alt="uploaded" style={{ width: '200px', height: '40%', objectFit: 'contain', cursor: "pointer" }} />
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: '100%',}}>
                          <button className="cardbutton" onClick={() => this.handleImageScroll(postIndex, -1)}>&lt;</button>
                          <button className="cardbutton" onClick={() => this.handleImageScroll(postIndex, 1)}>&gt;</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ borderRadius: "10px", alignItems: "center", justifyContent: "center", width: '100%', height: '100%' }}>
                      <img src={DUMMY_IMAGE_URL} alt="Default" style={{ width: '200px', height: '40%', objectFit: 'contain', cursor: "pointer" }} />
                    </div>
                  )}
                  
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: '100%',}}>
                    <h2 style={{fontSize: "1em"}}>{post.title}</h2>
                  </div>
                  <div className="itemdescription">
                    <p className="fontloader">{post.shortdescription}</p>
                  </div>
            </div>
          ))}

        </div>

              <div style={{height: "30px"}}></div>
        </div>
      </div>
    );
  }
}

export default withRouter(withAuth(Home));
