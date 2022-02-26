import React, { Component } from 'react';
import {connect} from 'react-redux'  // required to connect redux and app. Go to bottom page for config.

class Content extends Component {
  render(){
    return(
      <div>
        <div className="content"> 
          {/*--------------------------------*/}
          <div className="vertical-split">

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title1
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title2
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

          </div>
          {/*--------------------------------*/}
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title3
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          {/*--------------------------------*/}
          <div className="vertical-split">

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title4
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title5
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>

          </div>
          {/*--------------------------------*/}
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title6
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          {/*--------------------------------*/}
        </div>
        {/*--------------------------------*/}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    //todo
  }
}
export default connect(mapStateToProps)(Content);
