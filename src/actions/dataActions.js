import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

// Action types
export const SET_BUDGET_DATA = 'SET_BUDGET_DATA';
export const SET_INVESTMENT_DATA = 'SET_INVESTMENT_DATA';

// Action creators
export const setBudgetData = (data) => ({
  type: SET_BUDGET_DATA,
  payload: data,
});

export const setInvestmentData = (data) => ({
  type: SET_INVESTMENT_DATA,
  payload: data,
});

// Thunk to fetch all data
export const fetchData = (userId) => async (dispatch) => {
  try {
    // Fetch budget data from Firestore
    const budgetQuery = query(collection(db, "budgets"), where("userId", "==", userId));
    const budgetSnapshot = await getDocs(budgetQuery);
    const budgetData = budgetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (budgetData && budgetData.length > 0) {
      const income = budgetData.filter((item) => item.amount > 0);
      const expenses = budgetData.filter((item) => item.amount < 0);
      const balance = budgetData.reduce((acc, item) => acc + item.amount, 0);
      dispatch(setBudgetData({ income, expenses, balance, transactions: budgetData }));
    } else {
      dispatch(setBudgetData({ income: [], expenses: [], balance: 0, transactions: [] }));
    }

    // Fetch investment data from Firestore
    const investmentQuery = query(collection(db, "investments"), where("userId", "==", userId));
    const investmentSnapshot = await getDocs(investmentQuery);
    const investmentData = investmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    dispatch(setInvestmentData({ investments: investmentData }));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

// Thunk to fetch all data and update interest
export const fetchDataAndUpdate = (userId) => async (dispatch) => {
  try {
    // Fetch budget data
    const budgetQuery = query(collection(db, "budgets"), where("userId", "==", userId));
    const budgetSnapshot = await getDocs(budgetQuery);
    const budgetData = budgetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (budgetData && budgetData.length > 0) {
        const income = budgetData.filter((item) => item.amount > 0);
        const expenses = budgetData.filter((item) => item.amount < 0);
        const balance = budgetData.reduce((acc, item) => acc + item.amount, 0);
        dispatch(setBudgetData({ income, expenses, balance, transactions: budgetData }));
    } else {
        dispatch(setBudgetData({ income: [], expenses: [], balance: 0, transactions: [] }));
    }

    // Fetch investment data
    const investmentQuery = query(collection(db, "investments"), where("userId", "==", userId));
    const investmentSnapshot = await getDocs(investmentQuery);
    const investments = investmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate and update interest for each investment
    const updatedInvestments = await Promise.all(
      investments.map(async (investment) => {
        const now = new Date();
        const startDate = investment.startDate.toDate ? investment.startDate.toDate() : new Date(investment.startDate);
        const timeDiff = now.getTime() - startDate.getTime();
        const daysDiff = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));

        const annualRate = investment.rate / 100;
        const dailyRate = annualRate / 360;
        const totalAmount = investment.principal * Math.pow(1 + dailyRate, daysDiff);
        const interest = totalAmount - investment.principal;

        const updatedInvestment = { ...investment, interest };

        // Save the updated interest to Firestore
        const investmentRef = doc(db, "investments", investment.id);
        await updateDoc(investmentRef, { interest: interest });

        return updatedInvestment;
      })
    );

    dispatch(setInvestmentData({ investments: updatedInvestments }));
  } catch (error) {
    console.error('Failed to fetch and update data:', error);
  }
};
