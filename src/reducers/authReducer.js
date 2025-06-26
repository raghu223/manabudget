import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Add loading state
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false, // Set loading to false
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false, // Set loading to false
      };
    default:
      return state;
  }
};

export default authReducer;
