import {combineReducers} from 'redux'


import auth from './auth'
import nav from './nav'
import ble from './ble'


const rootReducer = combineReducers({
  nav ,
  auth ,
  ble
});


export default rootReducer;
