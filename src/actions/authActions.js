import { auth, db } from '../firebase';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { fetchData } from './dataActions';

// Action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';

// Action creators
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const signup = (name, email, password) => async (dispatch) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Add user to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email
        });

        dispatch(loginSuccess({ id: user.uid, name, email }));
        dispatch(fetchData(user.uid));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, errorCode: error.code };
    }
};

export const login = (email, password) => async (dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData;
    if (userDoc.exists()) {
      // User document exists, use it
      userData = userDoc.data();
    } else {
      // User document doesn't exist, create it as a fallback
      console.warn("User document not found in Firestore, creating one...");
      const newUserData = {
        name: user.displayName || email.split('@')[0], // Use display name or part of email
        email: user.email,
      };
      await setDoc(userDocRef, newUserData);
      userData = newUserData;
    }

    dispatch(loginSuccess({ id: user.uid, ...userData }));
    dispatch(fetchData(user.uid));
    return { success: true };

  } catch (err) {
    let errorMessage = 'Failed to login. Please try again.';
    switch (err.code) {
        case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
        default:
            errorMessage = err.message;
            break;
    }
    return { success: false, error: errorMessage, errorCode: err.code };
  }
};

export const sendPasswordReset = (email) => async () => {
    try {
        await sendPasswordResetEmail(auth, email);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
};

export const logout = () => async (dispatch) => {
    await signOut(auth);
    dispatch({
        type: LOGOUT,
    });
};

export const listenToAuthChanges = () => (dispatch) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch(loginSuccess({ id: user.uid, ...userData }));
        dispatch(fetchData(user.uid));
      } else {
        // Handle case where user exists in auth but not in firestore
        dispatch(logout());
      }
    } else {
      dispatch({ type: LOGOUT });
    }
  });
};
