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

    const annualRate = investment.rate / 100;
    const timeDiff = now.getTime() - startDate.getTime();
    const daysDiff = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    
    let interest = 0;

    if (investment.category === 'Gold Loan') {
      const oneYearInDays = 365;

      if (daysDiff <= oneYearInDays) {
        // Simple interest for the first year (or less)
        const dailyRate = annualRate / 360;
        interest = investment.principal * dailyRate * daysDiff;
      } else {
        // Overdue: monthly compounding on total outstanding after 1 year with penal interest
        const principal = investment.principal;
        
        // 1. Simple interest for the first year (using original rate)
        const interestFirstYear = principal * annualRate;

        // 2. Principal for compounding period starts after one year
        const compoundingPrincipal = principal + interestFirstYear;

        // Penal rate for overdue period
        const penalAnnualRate = (investment.rate + 2) / 100;

        // 3. Calculate the number of full months passed since the one-year mark
        const oneYearMark = new Date(startDate);
        oneYearMark.setFullYear(oneYearMark.getFullYear() + 1);

        let compoundingMonths = 0;
        if (now > oneYearMark) {
          compoundingMonths = (now.getFullYear() - oneYearMark.getFullYear()) * 12 + (now.getMonth() - oneYearMark.getMonth());
          if (now.getDate() < oneYearMark.getDate()) {
              compoundingMonths--;
          }
          compoundingMonths = Math.max(0, compoundingMonths);
        }

        // 4. Apply monthly compounding for each full month using penal rate
        const monthlyPenalRate = penalAnnualRate / 12;
        const compoundedAmount = compoundingPrincipal * Math.pow(1 + monthlyPenalRate, compoundingMonths);
        
        // 5. Calculate simple interest for the remaining days in the current partial month using penal rate
        const lastCompoundingDate = new Date(oneYearMark);
        if (compoundingMonths > 0) {
            lastCompoundingDate.setMonth(lastCompoundingDate.getMonth() + compoundingMonths);
        }
        
        const remainingTimeDiff = now.getTime() - lastCompoundingDate.getTime();
        const remainingDays = Math.max(0, Math.floor(remainingTimeDiff / (1000 * 3600 * 24)));
        const dailyPenalRate = penalAnnualRate / 360;
        const interestForRemainingDays = compoundedAmount * dailyPenalRate * remainingDays;

        // 6. Total interest is the sum of first year's interest, compounded interest, and remaining days' interest
        const totalCompoundedInterest = (compoundedAmount - compoundingPrincipal) + interestForRemainingDays;
        interest = interestFirstYear + totalCompoundedInterest;
      }
    } else {
      // Existing logic for "General" and "Bond"
      const dailyRate = annualRate / 360;
      interest = investment.principal * dailyRate * daysDiff;
    }

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
