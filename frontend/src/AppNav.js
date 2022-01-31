import React, { Component } from 'react'
import "./App.css";
import { getWeb3, getInstance}  from "./Web3Util";
import { withRouter} from 'react-router-dom';


/**
 * @App NFT Art Market using ERC-721
 * @author Yogesh K
**/

export class AppNav extends Component {

    constructor(props) {
      super(props); // compulsory call for all class constructors
      this.state = {
            name: '',
            symbol: ''
        };
    }

    // called automatically after component initialisation
    // set symbol and name
    componentDidMount = async () => {
      const web3 = await getWeb3();
      const contractInstance = await getInstance(web3);
      window.user = (await web3.eth.getAccounts())[0];
      const symbol = await contractInstance.methods.get_symbol().call()
      this.setState({ symbol: symbol });
      const name = await contractInstance.methods.get_name().call();
      this.setState({ name: name });
  }


  render() {
    return (
    <nav className="navbar navbar-expand-lg navbar-dark stylish-color">
                <div className="navbar-brand">  
                    <a className="navbar-item text-white" href="/"> 
                        <strong><i className="fa fa-coins"></i>NFT Art Market ( {this.state.name} | {this.state.symbol})</strong>  
                    </a>  
                </div> 
                <form className="form-inline  my-2 my-lg-0 ml-auto">
                    <a className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/">Finxter Gallery / </a>
                    <a className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/publishArt"> Publish Your Art / </a>
                    <a className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/mywallet"> Wallet Info </a>
                </form>
            </nav>

    );
  }
} // end of component

export default AppNav;
