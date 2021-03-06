import React from 'react';
import ReactDOM from 'react-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
// import 'bootstrap/dist/css/bootstrap.css';


import App from './components/App';
// import "bootstrap/dist/css/bootstrap.min.css";
import "./utils/bootstrap.min.css"


import * as serviceWorker from './serviceWorker';


// redux setup
import {Provider} from 'react-redux'
import configureStore from './store/configureStore';

// const store = configureStore()

ReactDOM.render(
	<Provider store = {configureStore()}>
		<App />
	</Provider>, 
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
