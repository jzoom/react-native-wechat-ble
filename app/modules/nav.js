
import React, { Component } from 'react';
import {addNavigationHelpers} from 'react-navigation'
import {connect} from 'react-redux'
import AppNavigator from '../navigators'

class Nav extends Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

export default connect((state)=>{
		return {
			nav: state.nav
		};
	})(Nav);