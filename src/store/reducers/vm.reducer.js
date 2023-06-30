import * as Actions from '../actions';

const dataReducer = function (state = {
    page: 0,
    listData: [],
    error: null
}, action) {
    switch ( action.type ) {
        case Actions.GET_DATA:
            return {
                page: action.page,
                listData: action.payload.data
            }
        case Actions.ERRORS:
            return {
                ...state,
                error: action.payload.data
            }
        default:
            return state;
    }
};

export default dataReducer;
