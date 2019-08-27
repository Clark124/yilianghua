import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools';

import IndexReducer from './pages/Compose/Index/reducer'


const reducer = combineReducers({
    home: IndexReducer,
    
})

const middlewares = [thunkMiddleware];


export default createStore(reducer, {}, composeWithDevTools(
    applyMiddleware(...middlewares),
));