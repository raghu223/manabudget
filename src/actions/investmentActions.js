import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";

// Action types
export const ADD_INVESTMENT_SUCCESS = 'ADD_INVESTMENT_SUCCESS';
export const DELETE_INVESTMENT_SUCCESS = 'DELETE_INVESTMENT_SUCCESS';
export const CALCULATE_INTEREST = 'CALCULATE_INTEREST';

// Action creators
export const addInvestment = (investmentData) => async (dispatch) => {
    try {
        const docRef = await addDoc(collection(db, "investments"), investmentData);
        dispatch({
            type: ADD_INVESTMENT_SUCCESS,
            payload: { id: docRef.id, ...investmentData },
        });
    } catch (error) {
        console.error("Error adding investment: ", error);
    }
};

export const calculateInterest = () => ({
  type: CALCULATE_INTEREST,
});

export const deleteInvestment = (id) => async (dispatch) => {
    try {
        await deleteDoc(doc(db, "investments", id));
        dispatch({
            type: DELETE_INVESTMENT_SUCCESS,
            payload: id,
        });
    } catch (error) {
        console.error("Error deleting investment: ", error);
    }
};
