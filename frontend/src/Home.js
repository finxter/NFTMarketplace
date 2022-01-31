import React, { Component } from 'react';
import { getWeb3, getInstance}  from "./Web3Util";
import AppNav from './AppNav';
import './App.css';


/**
 * @App NFT Art Market using ERC-721
 * @author Yogesh K
**/

export class Home extends Component {

  constructor(props) {
        super(props); // compulsory needed for every class component
        this.state = {
            hasData: false,
            message: "",    // message is actually not needed, can be removed
            rows:[],
            columns: [],
            // represents the Art params from smart contract
            tokenIds: [],
            title: [],
            desc: [],
            price: [],
            publishDate: [],
            author: [],
            image: [],
            total: 0,
            // End of art paramas
            contractInstance: '',
            user:''
        };
    }  // end of constructor


        // reset function to make them all empty arrays
    resetPendingArts() {
        this.setState({
            tokenIds: [],
            title: [],
            desc: [],
            price: [],
            publishDate: [],
            author: [],
            image: [],
            total: 0
        });
    }

   // is invoked immediately after a component is mounted (inserted into the tree of react)
   // This method is a good place to set up any subscriptions. 
   // get contract instance and metamask account info
    componentDidMount = async () => {
        const web3 = await getWeb3();
        window.web3 = web3;
        const contractInstance = await getInstance(web3);
        window.user = (await web3.eth.getAccounts())[0];
        this.setState({ user: window.user });
        this.setState({ contractInstance: contractInstance });
        await this.loadFinxterArts(web3);
    }

    async loadFinxterArts(web3) {
        try {
                let ids;
                const result = await this.state.contractInstance.methods.findAllPendingFinxterArt().call();
                ids = result[0];
                let _total = ids.length; // gives total ids

             if(ids && _total>0) {
                let row;
                if(_total<=3) {
                    row = 1;
                } else {
                    row = Math.ceil(_total/3);
                }
                let columns = 3;
                // will be needed in render
                this.setState({ rows: [], columns: [] });
                let rowArr = Array.from({ length: row }).map((currentElement, i) => i)
                let colArr = Array.from({ length: columns }).map((currentElement, i) => i)
                this.setState({ rows: rowArr, columns: colArr });

                let _tokenIds= [], _title =[],  _desc= [], _price= [], _publishDate= [],  _image =[], _author=[];
                let idx =0;
                this.resetPendingArts();  // this is to start everything clean

                for(let i = 0; i<row; i++) {
                    for(let j = 0; j < columns; j++) {
                        if(idx<_total) {
                            let tokenId= ids[idx];
                            const art = await this.state.contractInstance.methods.findFinxterArt(tokenId).call();
                            const priceInEther = web3.utils.fromWei(art[3], 'ether');
                            _tokenIds.push(art[0]);
                            _title.push(art[1]);
                            _desc.push(art[2]);
                            _price.push(priceInEther);
                            _publishDate.push(art[5]);
                            _image.push(art[9]);
                            _author.push(art[6]);
                        }
                    idx++;
                    }
                }
                // update all the received art info to actual state variables declared above
                this.setState({ 
                    tokenIds: _tokenIds,
                    title: _title,
                    desc: _desc,
                    price: _price,
                    publishDate: _publishDate,
                    author: _author,
                    image: _image,
                    total: _total
                });
                this.setState({ hasData: true });
            } // end of if
            else 
            {
                this.setState({ hasData: false });
            }
 
        } catch (e) {console.log('Error', e)}  // end of try
    } // end of async loadFinxterArts


    // This function is to buy a finxter art
    buyArt =  async(tokenId, priceInEther) =>
    {
        try {
            const priceInWei =  window.web3.utils.toWei(priceInEther, 'ether');
            await this.state.contractInstance.methods.buyFinxterArt(tokenId).send({
            from: this.state.user, gas: 6000000, value: priceInWei
            })
        window.location.reload();  // to refresh the page
        } catch (e) {console.log('Error', e)}
    }


  render() {
       if (this.state.hasData){
            return(
                    <div className="App">
                      <AppNav/>

                <section className="text-center">
                    <h5 className="h1-responsive font-weight-bold text-center my-5">Buy/Sell NFT Art on our Art Gallery</h5>
                    <div className="container">
                    {this.state.rows.map((row, i) =>
                        <div className="row" key={i}>
                        {this.state.columns.map((col, j) =>
                            <div className="col-lg-4 col-md-12 mb-lg-0 mb-0" key={j}>
                                { i*3+j < this.state.total &&                                    
                                    <div>
                                    <div className="view overlay rounded z-depth-3 mb-2">
                                    <img className="img-fluid" src={this.state.image[i*3+j]} alt="Sample"/>
                                    
                                    </div>
                                    <h6 className="pink-text font-weight-bold mb-1"><i className="fas fa-map pr-2"></i></h6>
                                    <div className="font-weight-bold orange-text deep-orange-lighter-hover">TokenId: {this.state.tokenIds[i*3+j]}</div>
                                    <h5 className="font-weight-bold mb-1">Title: {this.state.title[i*3+j]}</h5>
                                    <div className="dark-grey-text">{this.state.price[i*3+j]} (ether)</div>
                                    <p>by <span className="font-weight-bold">{this.state.author[i*3+j]}</span>, {this.state.publishDate[i*3+j]}</p>
                                    
                                    <p className="alert alert-primary dark-grey-text">{this.state.desc[i*3+j]}</p>
                                    <button className="btn btn-pink btn-rounded btn-md" onClick={e => (e.preventDefault(),this.buyArt(this.state.tokenIds[i*3+j], this.state.price[i*3+j]))}>Buy</button>
                                </div>
                                }
                            </div>

                        )}
                        </div>
                    )}
                    </div>
                    </section>
                </div>

            ) ;
       }
       else
       {
           return(
                <div className="App">
                    <AppNav/>
                    <section className="text-center">
                        <h5 className="h1-responsive font-weight-bold text-center my-5">Buy Art on our Finxter Art Gallery</h5>
                        <div className="container">
                        <div className="alert alert-primary" role="alert">
                            Publish your Finxter arts on Blockchain 
                        </div>
                        </div>
                    </section>
                </div>
           );
       }

    } // end of render
} // end of component

export default Home;
