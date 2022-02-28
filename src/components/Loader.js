import React from 'react'
import { 
	StickyBallLoading,
	MeteorRainLoading,
} from 'react-loadingg';

export default function({type}){
	if(type === 'table'){
		return(<StickyBallLoading color="white"/>)

	}if(type === 'Initialiser'){
		return (<MeteorRainLoading color="white" size="large"/>)
	}if(type === 'header'){
		return (<span className="spinner-border spinner-border-sm ml-auto" role="status" aria-hidden="true"></span>)
	}else{
		return(<div><StickyBallLoading color="white"/></div>)
	}
}