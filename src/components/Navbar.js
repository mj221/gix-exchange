import React, { Component } from 'react';
import Identicon from 'identicon.js';
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import gixLogo from '../assets/gix-logo2.png'

import './App.css'

import {connect} from 'react-redux'
import {accountSelector} from '../store/selectors'


const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Go to EtherScan
  </Tooltip>
)

class Navbar extends Component {

  render() {
    const identiconStyle ={
      width: 30,
      height: 30,
      borderRadius: 30 / 8,
      overflow: "hidden",
      marginRight: '10px'
    }
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-nowrap p-0 shadow">
        
        <a
          className="navbar-brand col-sm-3 col-md-2 mt-1"
          style = {{marginLeft: '10px'}}
          href="."
          rel="noopener noreferrer"
        >
          <div className= "nav-link-hover">
            <img src={gixLogo} height="30" className="mb-1 mr-2" style = {{color: 'white', marginRight: '10px', marginBottom: '10px'}}alt="" />
            Exchange
          </div>
        </a>
       
        <div className = "nav-link-hover">

          <ul className="navbar-nav px-2">
              <li className="navbar-item text-nowrap d-sm-block ">
                  {this.props.account !== ''
                      ? <><img
                    style = {identiconStyle}
                    width='30'
                    height='30'
                    onClick= {() => window.open(`https://etherscan.io/address/${this.props.account}`, "_blank")}
                    rel="noopener noreferrer"
                    src={`data:image/png;base64,${new Identicon(this.props.account, {size: 30,background: [10, 10, 10, 50], foreground: [255, 255, 255, 255]}).toString()}`}
                    alt="" /><span className="textshadow" style = {{color: 'white', marginRight: '5px'}}>|</span></>
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
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <small className="text-secondary">
                        <small 
                          id="account" 
                          style={{color: 'white'}}
                          >{this.props.account? this.props.account: ""}
                        </small>
                      </small>
                      
                    </OverlayTrigger>
                    
                  </a>
              </li>
          </ul>

        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return {
    account: accountSelector(state)
  }
}
export default connect(mapStateToProps)(Navbar);


