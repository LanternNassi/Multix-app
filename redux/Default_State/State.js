import { createStore , combineReducers }  from 'redux';
import BusinessReducer from '../Reducers/BusinessReducer.js';
import FunReducer from '../Reducers/FunReducer.js'

let rootReducer =  combineReducers({ fun : FunReducer , business : BusinessReducer })

export default store = createStore(rootReducer)




