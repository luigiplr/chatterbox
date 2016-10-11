import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import SettingsPage from 'containers/Settings'
import ChatPage from 'containers/Chat'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={ChatPage} />
    <Route path='/settings' component={SettingsPage} />
  </Route>
)
