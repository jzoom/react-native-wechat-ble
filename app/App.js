
import React, { Component } from 'react';

import {createStore,applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers/root'
import Nav from './modules/nav'
import NavHelper from './lib/NavHelper'
import ReactNavigationPlugin from './lib/ReactNavigationPlugin'



const createStoreWithMiddleware = applyMiddleware(
 thunk
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
NavHelper.setPlugin(new ReactNavigationPlugin(store));

/**
 * root会有特殊
 */
export default class Root extends Component {
  componentWillMount() {
    //开始加载
  }

  render() {
    return (
      <Provider store={store}>
        <Nav />
      </Provider>
    );
  }
}

