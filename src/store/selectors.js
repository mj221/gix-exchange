import {get} from 'lodash' // deal with errors; prevents breaking
import {createSelector} from 'reselect' //from redux

// const account = state => state.web3.account
// export const accountSelector = createSelector(account, account => account)
// export const accountSelector = createSelector(account, (account) => {account})
const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)


/// Check if necessary contracts are loaded
const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

// const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
// export const contractLoadedSelector = createSelector(contractLoaded, cl => cl)
export const contractLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
)
