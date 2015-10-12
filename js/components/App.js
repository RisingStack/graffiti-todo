import React from 'react';
import Relay from 'react-relay';

import TodoApp from './TodoApp';
import AppRoute from '../routes/AppRoute';

export default class App extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={TodoApp}
        route={new AppRoute} />
    );
  }
}
