import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Upload from "./pages/upload";
import Profile from "./pages/profile";
import Experts from "./pages/experts";
import Request from "./pages/requests";
import UploadList from "./pages/uploadlist";

import "./App.css";

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/experts">
            <Experts />
          </Route>
          <Route path="/uploadlist">
            <UploadList />
          </Route>
          <Route path="/requests">
            <Request />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
