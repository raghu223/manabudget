import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";

// Action types
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';

// Action creators
export const addTransactionSuccess = (transaction) => ({
    type: ADD_TRANSACTION,
    payload: transaction,
});

export const addTransaction = (transactionData) => async (dispatch) => {
    try {
        const docRef = await addDoc(collection(db, "budgets"), transactionData);
        dispatch(addTransactionSuccess({ id: docRef.id, ...transactionData }));
    } catch (error) {
        console.error('Failed to add transaction:', error);
    }
};

export const deleteTransactionSuccess = (id) => ({
  type: DELETE_TRANSACTION,
  payload: id,
});

export const deleteTransaction = (id) => async (dispatch) => {
  try {
    await deleteDoc(doc(db, "budgets", id));
    dispatch(deleteTransactionSuccess(id));
  } catch (error) {
    console.error('Failed to delete transaction:', error);
  }
};
