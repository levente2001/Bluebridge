import React from "react";
import { withRouter } from 'react-router-dom';
import { withAuth } from "../components/auth";
import Firebase from "firebase";
import { initialize } from "../utils/firebase";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      planecat: '',
      desc: '',
      images: [],
      urls: [],
      progress: 0,
      title: '',
      shortdescription: '',
      longdescription: '',
      imageData: [],
      type: ''
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = e => {
    if (e.target.files) {
      let images = [];
      for (let i = 0; i < e.target.files.length; i++) {
        images.push(e.target.files[i]);
      }
      this.setState({ images: images });
    }
  };

  handleUpload = () => {
    initialize();
    const promises = [];
    this.state.images.forEach(image => {
      const uploadTask = Firebase.storage().ref(`images/${image.name}`).put(image);
      promises.push(new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ progress });
          },
          error => {
            console.log(error);
            reject(error);
          },
          async () => {
            const url = await uploadTask.snapshot.ref.getDownloadURL();
            resolve(url);
          }
        );
      }));
    });
  
    Promise.all(promises)
      .then(urls => { // Note that 'urls' is an array of all uploaded image URLs
        // post image URLs to realtime database
        const data = {
          imageURLs: urls, // Change 'imageURL' to 'imageURLs' to reflect that it's an array
          timestamp: Date.now(),
          title: this.state.title,
          shortdescription: this.state.shortdescription,
          longdescription: this.state.longdescription,
          type: "service"
        };
        Firebase.database().ref('images/').push().set(data);
        this.setState({ 
          urls: [],
          title: '',
          shortdescription: '',
          longdescription: '',
          progress: 0,
          images: [],
        });
        //alert('All files uploaded');
        this.props.history.push('/');
      })
      .catch(err => console.log(err));
  };
  

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
   
    return (
      <div className="container">
        <div className="uploadscreen">
            <div className="uploadform">
                <progress value={this.state.progress} max="100" />
                <br />
                <input className="shortdesc-textarea" type="text" name="title" placeholder="Title" onChange={this.handleInputChange} />
                <input type="text" name="shortdescription" placeholder="Short Description" rows="10" onChange={this.handleInputChange} />
                <textarea type="text" name="longdescription" placeholder="Long Description" rows="10" onChange={this.handleInputChange} />
                <input type="file" onChange={this.handleChange} multiple />
                <button onClick={this.handleUpload}>Upload</button>
            </div>
        </div>
      </div>
    );
  }
   
}

export default withRouter(withAuth(Home));

