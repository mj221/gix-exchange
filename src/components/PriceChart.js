import React, { Component } from 'react';
import {connect} from 'react-redux'

import Chart from '@mj221/kaktana-react-lightweight-charts-apo-fork'

import {lightChartOptions} from './LightChart.config.js'


import Loader from './Loader'
import poiLogo from '../assets/poi-logo.png'

import {
	priceChartLoadedSelector,
	priceChartSelector
} from '../store/selectors'

// import { json, checkStatus } from "../utils/utils"

const priceSymbol = priceChange =>{
	let output
	if(priceChange === '+'){
		output = <span className="text-success">&#9650;</span>
	}else{
		output = <span className="text-danger">&#9660;</span>
	}
	return output
}

class PriceChart extends Component{
	// constructor(props) {
 //    super(props)
 //    this.state = {
 //      OneHourData: '',
 //    }
 //  }
	// componentDidMount(){
	// 	const getOneHourData = () => {
	//     let url = `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h&limit=1000`;
	//     fetch(url, {
	//       method: "GET",
	//       mode: "cors",
	//     })
	//       .then(checkStatus)
	//       .then(json)
	//       .then((response) => {
	//         const cData = response.map((d) => {
	//           return {
	//             time: d[0] / 1000,
	//             open: parseFloat(d[1]),
	//             high: parseFloat(d[2]),
	//             low: parseFloat(d[3]),
	//             close: parseFloat(d[4]),
	//           };
	//         });
	//         let temp = [{
	//         	data: cData
	//         }]
	//         // console.log(temp)
	//         this.setState({OneHourData: temp})
	        
	//       })
	//       .catch((error) => {
	//         console.log(error);
	//       });
	//   };
	//   getOneHourData()
	// }

	showPrice = priceChart =>{
		return (
			<span>
				<img src={poiLogo} height="21" style={{marginRight: '10px'}} alt="" />
				POI/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}
			</span>
		)
	}

  showLightChart = (props) =>{
  	const {priceChart} = props

  	const overwriteOptions = {
	    priceFormat: {
	        type: 'price',
	        precision: 5,
	        minMove: 0.00001,
	    }
		};
		return (
			<div className="price-chart">
				<Chart
					legend= "POI / ETH, GiX, [1H]"
					options={lightChartOptions} 
					candlestickSeries={priceChart.series} 
					// candlestickSeries = {this.state.OneHourData}
					autoWidth 
					autoHeight 
					darkTheme
					applyOptions = {overwriteOptions}
					alwaysClean = {false}
				/>
			</div> 
		)
	}
	render() {
		return(
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center" style={{justifyContent: 'space-between'}}>
					{/*<span>Price Chart</span>*/}
					{this.showPrice(this.props.priceChart)}
          {this.props.priceChartLoaded
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>
				<div className="card-body p-0 chart">

						<div className="p-0" ref={this.myRef} id = "price-chart" ></div>

	          {this.props.priceChartLoaded
	          	?this.showLightChart(this.props)
	          	:<div></div>
	          }
				</div>
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
		priceChartLoaded: priceChartLoadedSelector(state),
		priceChart: priceChartSelector(state)
	}
}
export default connect(mapStateToProps)(PriceChart);