import { ADD_INVESTMENT_SUCCESS, CALCULATE_INTEREST, DELETE_INVESTMENT_SUCCESS } from '../actions/investmentActions';
import { SET_INVESTMENT_DATA } from '../actions/dataActions';

const initialState = {
  investments: [],
};

const calculateAllInterests = (investments) => {
  return investments.map((investment) => {
    const now = new Date();
    // Normalize startDate from either a Firestore Timestamp or a Date object/string
    const startDate = investment.startDate?.toDate ? investment.startDate.toDate() : new Date(investment.startDate);

    // If the date is invalid, log an error and return the investment as is to prevent crashing.
    if (isNaN(startDate.getTime())) {
      console.error("Invalid start date for investment:", investment);
      return { ...investment, interest: 0 };
    }

    const timeDiff = now.getTime() - startDate.getTime();
    const daysDiff = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));

    // Changed to Simple Interest using a 360-day year as requested.
    const annualRate = investment.rate / 100;
    const dailyRate = annualRate / 360;
    const interest = investment.principal * dailyRate * daysDiff;

    return {
      ...investment,
      startDate: startDate, // Ensure the normalized Date object is stored in the state
      interest: interest,
    };
  });
};

const investmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVESTMENT_SUCCESS: {
      const newInvestments = [...state.investments, action.payload];
      return {
        ...state,
        investments: calculateAllInterests(newInvestments),
      };
    }
    case DELETE_INVESTMENT_SUCCESS:
        return {
            ...state,
            investments: state.investments.filter(
                (investment) => investment.id !== action.payload
            ),
        };
    case CALCULATE_INTEREST:
      return {
        ...state,
        investments: calculateAllInterests(state.investments),
      };
    case SET_INVESTMENT_DATA:
      return {
        ...state,
        investments: calculateAllInterests(action.payload.investments || []),
      };
    default:
      return state;
  }
};

export default investmentReducer;
