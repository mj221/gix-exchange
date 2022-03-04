import React, { Component } from 'react';
import {connect} from 'react-redux'

import Chart from 'react-apexcharts'
import Loader from './Loader'

import {chartOptions} from './PriceChart.config.js'
import {
	priceChartLoadedSelector,
	priceChartSelector
} from '../store/selectors'

const priceSymbol = priceChange =>{
	let output
	if(priceChange === '+'){
		output = <span className="text-success">&#9650;</span>
	}else{
		output = <span className="text-danger">&#9660;</span>
	}
	return output
}
const showPriceChart = priceChart =>{
	return (
		<div className="price-chart">
			
			<div className="price">
				<h4>POI/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
			</div>

			<Chart options={chartOptions} series={priceChart.series} type='candlestick' width='100%' height='100%'/>
		</div> 
	)
}

class PriceChart extends Component{
	render() {
		return(
			<div className="card bg-dark text-white">
				<div className="card-header d-flex align-items-center">
					<span>Price Chart</span>
          {this.props.priceChartLoaded
            ?<span></span>
            :<Loader type="header"/>
          }
				</div>
				<div className="card-body">
					{this.props.priceChartLoaded
            ?showPriceChart(this.props.priceChart)
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