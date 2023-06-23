import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';






// googleでログインここから
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = (successFunc, errorFunc) => {
        signInWithPopup(auth, googleProvider).then((result) => {
            successFunc(result);
            return [true, result];
        }).catch((error) => {
            errorFunc(error);
            return [false, error];
        });
    }

export {signInWithGoogle};
// // googleでログインここまで






// // ログイン状態の観察ここから
export {onAuthStateChanged, auth};
// // ログイン状態の観察ここまで