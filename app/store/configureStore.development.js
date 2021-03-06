import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware, push } from 'react-router-redux'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const logger = createLogger({
  level: 'log',
  duration: true,
  collapsed: true
})

const router = routerMiddleware(hashHistory)

const enhancer = compose(
  applyMiddleware(thunk, router, logger),
  window.devToolsExtension ?
  window.devToolsExtension() : noop => noop
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store)
  }

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    )
  }

  return store
}
