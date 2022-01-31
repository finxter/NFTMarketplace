import Web3 from 'web3';
import finxterArtContract from './abi/finxterArt.json';


// getting the metamask info from browser
export const getWeb3 = () =>
    new Promise((resolve, reject) => {
    window.addEventListener("load", async () => { // this line is for browser load
    if (window.ethereum) {  // for modern browsers
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            console.log("Modern usage detected.");
            resolve(web3);
        } catch (error) {
        reject(error);
        }
    } else if (window.web3) {  // legacy browsers and metamask
        // load metamask provider
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
    }
    });
});



// getting the deployed instance of the contract
// window.user and window.instance are global variables in react
// and can be used across components

export const getInstance = async (web3) => {

    const networkId = await web3.eth.net.getId();
    window.user     = (await web3.eth.getAccounts())[0];
    const deployedNetwork = finxterArtContract.networks[networkId];

    window.instance = new web3.eth.Contract(
                        finxterArtContract.abi,
                        deployedNetwork && deployedNetwork.address,
                        {
                            from: window.user
                        }
    );

    return window.instance;
}