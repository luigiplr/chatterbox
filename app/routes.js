import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { App, LoginPage, ChatPage, SettingsPage } from 'containers'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={ChatPage} />
    <Route path='/settings' component={SettingsPage} />
    <Route path='/login' component={LoginPage} />
  </Route>
)
