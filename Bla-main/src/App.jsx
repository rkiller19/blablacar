import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Staking, Farming, Bridge, ConnectWallet } from './pages'

export function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={ConnectWallet} exact />
          <Route path="/farming" component={Farming} />
          <Route path="/staking" component={Staking} />
          <Route path="/bridge" component={Bridge} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
