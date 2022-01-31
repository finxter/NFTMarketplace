import React, { Component } from 'react';
import './App.css';
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";

/**
 * @App NFT Art Market using ERC-721
 * @author Yogesh K
**/

export class App extends Component {
  render() {
    return (
     <Router>
        <div>
            <AppRoutes />
        </div>
      </Router>
    );
  }
}


export default App;
