import React from "react";
import { Redirect, withRouter, Link } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Firebase from "firebase";
import { signOut } from "../utils/firebase";
import { FaBars, FaTimes } from 'react-icons/fa';

import DUMMY_IMAGE_URL from "../assets/manwithlaptop.png";
import DUMMY_IMAGE_URLL from "../assets/dummy-post-horisontal.jpg";
import plane from '../assets/banner.png';
//import business from '../assets/offer.png';
//import freelan from '../assets/freelan.png';
//import moneyy from '../assets/moneyy.png';
//import helpyou from '../assets/helpyou.png';

import one from '../assets/postonline.png';
import two from '../assets/postonlinee.png';
import three from '../assets/postonlineee.png';

import bannerimg from '../assets/blou_logo_0 másolat.png';

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
      isActive: false,
      isPostRequestVisible: false,
      isReviewOffersVisible: false,
      isGetItDoneVisible: false
    };
    this.slideInElement = React.createRef();
    this.postRequestElement = React.createRef();
    this.reviewOffersElement = React.createRef();
    this.getItDoneElement = React.createRef(); 
  }

  handleScroll = () => {
    // Use the ref to get the DOM element
    const el = this.slideInElement.current;
    
    const slideInAt = (window.scrollY + window.innerHeight) - el.clientHeight / 2;
    const elementBottom = el.offsetTop + el.clientHeight;
    const isHalfShown = slideInAt > el.offsetTop;
    const isNotScrolledPast = window.scrollY < elementBottom;
    const postRequestEl = this.postRequestElement.current;
    const reviewOffersEl = this.reviewOffersElement.current;
    const getItDoneEl = this.getItDoneElement.current;
    
    this.setState({ isActive: isHalfShown && isNotScrolledPast });

    this.setState({
      isPostRequestVisible: this.isElementVisible(postRequestEl),
      isReviewOffersVisible: this.isElementVisible(reviewOffersEl),
      isGetItDoneVisible: this.isElementVisible(getItDoneEl)
    });
}

isElementVisible = (el) => {
  const slideInAt = (window.scrollY + window.innerHeight) - el.clientHeight / 2;
  const elementBottom = el.offsetTop + el.clientHeight;
  const isHalfShown = slideInAt > el.offsetTop;
  const isNotScrolledPast = window.scrollY < elementBottom;

  return isHalfShown && isNotScrolledPast;
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
    window.addEventListener('scroll', this.handleScroll);

    // Set up media query listener
    this.mql = window.matchMedia('(max-width: 768px)');
    this.mql.addListener(this.handleMediaQuery);
    // Trigger once on mount
    this.handleMediaQuery(this.mql);

    const dbb = Firebase.database().ref("images").orderByChild('type').equalTo('service');
    dbb.on("value", snapshot => {
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
    window.removeEventListener('scroll', this.handleScroll);
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
            <img onClick={() => this.props.history.push('/')} style={{width: 120, borderRadius: 20, cursor: "pointer",}} src={bannerimg} alt="description" />
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


        <div className="homepage">
          <div className="homepageinside">
            <h3>Find an expert for <br />any kind of task</h3>
            <img className="img border-radius" src={plane} alt="description" />
          </div>

          <div style={{marginTop: 100, height: 80, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h1>Best rated experts</h1>
          </div>


          <div className="itemslisthomepage">
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
                      <img src={DUMMY_IMAGE_URLL} alt="Default" style={{ width: '200px', height: '40%', objectFit: 'contain', cursor: "pointer", borderRadius: "10px"}} />
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






          {/*<div style={{marginTop: 10, display: "flex", alignItems: "center", textAlign: "justify", padding: 10, borderRadius: 20, justifyContent: "space-between", width: "90%"}}>
            <div className="sectwocards">
              <img width="50" height="50" style={{marginBottom: 30}} src={business} alt="business"/>
              <p className="justifiedd">Post a Job</p>
              <p >Aliquam pretium fringilla augue orci dictum sollicitudin purus risus.</p>
            </div>
            <div className="sectwocards">
              <img width="50" height="50" style={{marginBottom: 30}} src={freelan} alt="business"/>
              <p className="justifiedd">Choose freelancers</p>
              <p >Aliquam pretium fringilla augue orci dictum sollicitudin purus risus.</p>
            </div>
            <div className="sectwocards">
              <img width="50" height="50" style={{marginBottom: 30}} src={moneyy} alt="business"/>
              <p className="justifiedd">Pay safely</p>
              <p >Aliquam pretium fringilla augue orci dictum sollicitudin purus risus.</p>
            </div>
            <div className="sectwocards">
              <img width="50" height="50" style={{marginBottom: 30}} src={helpyou} alt="business"/>
              <p className="justifiedd">We are to help</p>
              <p >Aliquam pretium fringilla augue orci dictum sollicitudin purus risus.</p>
            </div>
                  </div>*/}


          <div className="homepageinsidesectwo">
            <div className={`sectwocardss slide-in ${this.state.isActive ? 'active' : ''}`} ref={this.slideInElement}>
              <img className="imgcard" src={DUMMY_IMAGE_URL} alt="description" />
              <p className="justified">Maecenas varius porttitor ipsum consequat.</p>
              <Link className="linkkk" to="/upload">Post a request</Link>
            </div>

            <div className={`sectwocardss slide-inn ${this.state.isActive ? 'active' : ''}`}>
              <img className="imgcard" src={DUMMY_IMAGE_URL} alt="description" />
              <p className="justified">Maecenas varius porttitor ipsum consequat.</p>
              <Link className="linkkk" to="/uploadlist">List a service</Link>
            </div>
          </div>


          <div style={{marginTop: 100, height: 80, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h1>How it works</h1>
          </div>


          <div style={{marginTop: 10, display: "flex", alignItems: "center", textAlign: "justify", padding: 10, borderRadius: 20, justifyContent: "space-between", width: "80%"}}>
            <div ref={this.postRequestElement} className={`sectwocardss slide-innn ${this.state.isPostRequestVisible ? 'activee' : ''}`}>
              <div style={{width: 100, height: 100, borderRadius: 150, backgroundColor: "#fff",  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
                <img width="50" height="50"  src={one} alt="business"/>
              </div>
              <p className="justified">Post a Request</p>
            </div>
            <div ref={this.reviewOffersElement} className={`sectwocardss slide-innn ${this.state.isReviewOffersVisible ? 'activee' : ''}`}>
              <div style={{width: 100, height: 100, borderRadius: 150, backgroundColor: "#fff",  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
                <img width="50" height="50"  src={two} alt="business"/>
              </div>
              <p className="justified">Review Offers</p>
            </div>
            <div ref={this.getItDoneElement} className={`sectwocardss slide-innn ${this.state.isGetItDoneVisible ? 'activee' : ''}`}>
              <div style={{width: 100, height: 100, borderRadius: 150, backgroundColor: "#fff",  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30}}>
                <img width="50" height="50"  src={three} alt="business"/>
              </div>
              <p className="justified">Get It Done</p>
            </div>
          </div>
          


          <div style={{marginTop: 100, height: 80, display: "flex", alignItems: "center", justifyContent: "center"}}>
          </div>


          <div style={{height: 40, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 50}}>
            <p>&copy;BlueBridge All Rights Resevred. </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withAuth(Home));
