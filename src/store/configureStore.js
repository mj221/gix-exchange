// Redux convenient standard setup
import {createStore, applyMiddleware, compose} from 'redux'
import {createLogger} from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()
const middleware = []

// For redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// let store = createStore(
// 	rootReducer,
// 	preloadedState
// )

export default function configureStore(preloadedState){
	return createStore(
		// rootReducer from ./reducer.js
		rootReducer,
		preloadedState,
		composeEnhancers(applyMiddleware(...middleware,loggerMiddleware))
	)
}