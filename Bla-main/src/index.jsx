import React from 'react'
import ReactDOM from 'react-dom'
import { DAppProvider } from '@usedapp/core'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import './sass/index.scss'
import { App } from './App'
import { rootReducer } from './reducers'
import { supportedChains } from './constants'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

const config = {
  supportedChains,
}

ReactDOM.render(
  <Provider store={store}>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </Provider>,
  document.getElementById('root'),
)
