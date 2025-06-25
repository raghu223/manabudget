import { combineReducers } from 'redux';
import authReducer from './authReducer';
import budgetReducer from './budgetReducer';
import investmentReducer from './investmentReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  budget: budgetReducer,
  investment: investmentReducer,
});

export default rootReducer;
