import React, { Component } from 'react';
import Identicon from 'identicon.js';
import gixLogo from '../gix-logo2.png'
import './App.css'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-nowrap p-0 shadow">
        
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="."
          rel="noopener noreferrer"
        >
          <div className= "nav-link-hover">
            <img src={gixLogo} height="30" className="mb-1 mr-2" alt="" />
            Exchange
          </div>
        </a>
       
        <div className = "nav-link-hover" title = "Go to Etherscan">

          <ul className="navbar-nav px-2">
              <li className="navbar-item text-nowrap d-none d-sm-none d-sm-block">
                  {this.props.account 
                      ? <><img
                    className="mr-2"
                    width='30'
                    height='30'
                    onClick= {() => window.open(`https://etherscan.io/address/${this.props.account}`, "_blank")}
                    rel="noopener noreferrer"
                    src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                    alt="" /><span className="textshadow mr-1" style = {{color: 'white'}}>|</span></>
                      :<span><button 
                                className="btn btn-light"
                                onClick={()=>{
                                  this.props.configMetaMask()
                                }}
                                >
                                  Connect Wallet
                              </button>
                      </span>
                  }
                  <a 
                    className="account-etherscan"
                    href={`https://etherscan.io/address/${this.props.account}`}
                    rel="noopener noreferrer"
                    target="_blank"                  
                    >

                    <small className="text-secondary">
                        
                        <small 
                          id="account" 
                          style={{color: 'white'}}>{this.props.account? this.props.account: ""}
                        </small>
                    
                    </small>
                  </a>
              </li>
          </ul>

        </div>
      </nav>
    );
  }
}

export default Navbar;