import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { loadUserDataPath } from 'lib/settings'
import routes from './routes'
import configureStore from './store/configureStore'
import 'react-virtualized/styles.css'
import 'styles/vender/normalize.css'

loadUserDataPath()
global._teams = {}
const store = configureStore()
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
