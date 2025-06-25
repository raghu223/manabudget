import { ADD_TRANSACTION, DELETE_TRANSACTION } from '../actions/budgetActions';
import { SET_BUDGET_DATA } from '../actions/dataActions';

const initialState = {
  transactions: [],
  income: [],
  expenses: [],
  balance: 0,
};

const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION:
      const newTransaction = action.payload;
      return {
        ...state,
        transactions: [...state.transactions, newTransaction],
        balance: state.balance + newTransaction.amount,
        income: newTransaction.amount > 0 ? [...state.income, newTransaction] : state.income,
        expenses: newTransaction.amount < 0 ? [...state.expenses, newTransaction] : state.expenses,
      };
    case DELETE_TRANSACTION:
      const transactionToDelete = state.transactions.find(t => t.id === action.payload);
      if (!transactionToDelete) return state;

      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
        income: state.income.filter((transaction) => transaction.id !== action.payload),
        expenses: state.expenses.filter((transaction) => transaction.id !== action.payload),
        balance: state.balance - transactionToDelete.amount,
      };
    case SET_BUDGET_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default budgetReducer;
