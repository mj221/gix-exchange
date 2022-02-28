import React, { Component } from 'react';
// import React, { Component, useState } from 'react';
// import detectEthereumProvider from '@metamask/detect-provider'

import './App.css';
import Navbar from './Navbar'
import Content from './Content'

import {
  loadWeb3, 
  loadAccount, 
  loadToken,
  loadExchange
} from '../store/interactions'
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

import {contractLoadedSelector} from '../store/selectors'

const ethereum = window.ethereum

// function App() {
//   const[count , setCount]=useState(0);
//   return (
//     <div className="App">
      
//     </div>
//   );
// }
class App extends Component {
  componentDidMount = async () =>{
    if(ethereum){
      ethereum.sendAsync({
        method: "eth_accounts",
        params: [],
        jsonrpc: "2.0",
        id: new Date().getTime()
        } , async (error, result) =>{
            // console.log(result);
            if (result["result"].toString() !== "") {
              await this.configMetaMask();//addresses found. result["result"] contains wallet address
            }else {console.log("MetaMask account may not be connected");}//found not address, which mean this wallet is not logged in
        });

      ethereum.on('accountsChanged', async (accounts) => {
        // console.log("Account changed: ", accounts) 
        if (accounts[0] != null){
          await loadAccount(accounts[0], this.props.dispatch)
        } else{
          this.setState({account: ''})
          await loadAccount('', this.props.dispatch)
        }
        this.loadBlockchainData(this.props.dispatch)
      });

      ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      this.loadBlockchainData(this.props.dispatch)
    }
    

  }
  async configMetaMask () {
    if(ethereum){
      try{
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if(accounts !== null){
          console.log("Account:", accounts[0])
          await loadAccount(accounts[0], this.props.dispatch)
        }
      }catch (err){
        if (err.code === 4001){
          console.log("User denied MetaMask. Please connect MetaMask again.")
        }else{
          console.log(err)
        }
      }
      
    }else{
      window.alert("Non-Ethereum browser detected. Try using MetaMask.")
    }
  }

  async loadBlockchainData(dispatch) {
    const web3 = await loadWeb3(dispatch)

    const networkId = await ethereum.request({ method: 'eth_chainId' })

    const token = await loadToken(web3, networkId, dispatch)
    if(!token){
      window.alert("Token contract not deployed on the current network. Please connect to the specified network.")
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange){
      window.alert("Exchange contract not deployed on the current network. Please connect to the specified network.")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
    }
  }
  render(){
    return(
      <div>
        <Navbar configMetaMask= {this.configMetaMask.bind(this)}/>
        {this.props.contractLoaded
          ? <Content />
          : <div style={{height: '100vh', backgroundColor: '#1d1d1d', color: 'white'}} id="loader" className="text-center d-flex align-items-center justify-content-center">LOADING...</div>
        }
        
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    contractLoaded: contractLoadedSelector(state)
  }
}
export default connect(mapStateToProps)(App);


// export default App;
