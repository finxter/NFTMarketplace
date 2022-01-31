import React, { Component } from 'react';
import { getWeb3, getInstance}  from "./Web3Util";
import AppNav from './AppNav';
import './App.css';

/**
 * @App NFT Art Market using ERC-721
 * @author Yogesh K
 */

export class Publish extends Component {
      constructor(props) {
        super(props);
        this.state = { 
            imageValue: 'images/whale.png',
            description: '',
            title: '', 
            authorName: '',
            price: 0,
            date:'',
            user: '',
            balance: 0,
            contractInstance: '',
            networkId:'',
            networkType:'',
        };
        this.imageChange = this.imageChange.bind(this); // change image
        this.submitHandler = this.submitHandler.bind(this); // called when we submit the form (i.e. publish)
        this.changeHandler = this.changeHandler.bind(this); // gets called when we edit the image/art form info
      }

    // gets called automatically after component creation
    componentDidMount = async () => {
        const web3 = await getWeb3();
        window.web3 = web3;
        const contractInstance = await getInstance(web3);
        window.user = (await web3.eth.getAccounts())[0];
        const balanceInWei = await web3.eth.getBalance(window.user);
        var balance = web3.utils.fromWei(balanceInWei, 'ether');
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        this.setState({ user: window.user });
        this.setState({ balance: balance});
        this.setState({ contractInstance: contractInstance });
        this.setState({ networkId: networkId});
        this.setState({ networkType: networkType});
      }

      isNotEmpty(val) {
        return val && val.length>0;
    }
      // gets called when change in image occurs
      imageChange = (event) => {
        this.setState({ imageValue: event.target.value });
      };

      // get called when any update in the form
      changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
            }, function(){ })
    };
      // gets called when we click publish option
      submitHandler = (event) => {
        event.preventDefault(); // react default function to be called
        const {  imageValue, description, title, authorName, price, date} = this.state;
        if(this.isNotEmpty(title) &&this.isNotEmpty(description) &&this.isNotEmpty(authorName) 
            &&this.isNotEmpty(date)&&this.isNotEmpty(imageValue) && this.isNotEmpty(price)) {
            const priceInWei =  window.web3.utils.toWei(price, 'ether');
            this.publishArt(title, description, date, authorName, priceInWei, imageValue);  
        }
    }; 

      async publishArt(title, description, date, authorName, price, imageValue) {
        try {
            await this.state.contractInstance.methods.createFinxterToken(title,description, date, authorName, price, imageValue).send({
                from: this.state.user
            })
            this.props.history.push(`/home`) // automatically move to home page after publishing
            window.location.reload(); 
        } catch (e) {console.log('Error', e)}
    }

    render() {
    return (
        <div>
            <AppNav></AppNav>

            <section className="mx-auto" style={{ marginTop: '20px'}}>
                <div className="row">
                    <div className="col-md-2 mb-md-0 mb-5"></div>
                    <div className="col-md-8 mb-md-0 mb-5">
                        <div className="card">
                            <div className="card-body">
                                <form className="text-center border border-light p-5" onSubmit={this.submitHandler}>
                                    <p className="h4 mb-4">Submit your NFT art today.</p>
                                    <div className="row">
                                        <div className="col-md-6 mb-md-0 mb-5">
                                            <input className="form-control mb-4" id="title" name="title" type="text" placeholder="Title" onChange={this.changeHandler}  value={this.state.title}/>
                                            <input className="form-control mb-4" id="description" name="description"  type="text" placeholder="Description" onChange={this.changeHandler}  value={this.state.description}/>
                                           <input className="form-control mb-4" id="authorName" name="authorName" type="text" placeholder="Author Name" onChange={this.changeHandler}  value={this.state.authorName}/>

                                        </div>
                                        <div className="col-md-6 mb-md-0 mb-5">
                                           <input className="form-control mb-4" id="price" name="price"  type="text" placeholder="Price (ether)"  onChange={this.changeHandler}  value={this.state.price}/>
                                           <input className="form-control mb-4" id="date" name="date"  type="text" placeholder="Date" onChange={this.changeHandler}   value={this.state.date}/>
                                            <select className="browser-default custom-select" onChange={this.imageChange} value={this.state.imageValue}>
                                                    <option value="images/bear.png">images/bear.png</option>
                                                    <option value="images/cat.png">images/cat.png</option>
                                                    <option value="images/dog.png">images/dog.png</option>
                                                    <option value="images/horse.png">images/horse.png</option>
                                                    <option value="images/monkey.png">images/monkey.png</option>
                                                    <option value="images/pug.png">images/pug.png</option>
                                                    <option value="images/whale.png">images/whale.png</option>
                                            </select>
                                            <img className="imgBox z-depth-4 rounded" alt="art" src={this.state.imageValue} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-5 mb-md-0 mb-5"></div>
                                        <div className="col-md-2 mb-md-0 mb-5"><button className="btn btn-info btn-block" type="submit">Publish</button></div>
                                        <div className="col-md-5 mb-md-0 mb-5"></div>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-md-0 mb-5"></div>
                </div>

            </section>

        </div>
    );  // end of render
  } 
} // end of publish

export default Publish;
