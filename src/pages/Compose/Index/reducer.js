import {
   CHANGE_HEADER_INDEX
} from './actionTypes'

export default (state = {
    headerIndex:0,
  
}, action) => {
    switch (action.type) {
        case CHANGE_HEADER_INDEX:{
            return {
                ...state,headerIndex:action.index
            }
        }
        default: {
            return state
        }
    }
}