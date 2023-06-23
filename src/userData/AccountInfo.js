import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

class AccountInfo {
    constructor(accountInfo, setLoadFlags) {
        this._data = accountInfo;
        // ContemporaryRegisterデータの生成
        const contemporaryDocRef = doc(db, "ContemporaryRegister", accountInfo["uid"]);
        getDoc(contemporaryDocRef).then(result => {
            if (result.data() === undefined) {
                setDoc(contemporaryDocRef, {lastSection: null});
            }
        });
        setLoadFlags((prevState) => {
            const update = prevState;
            update["Account"] = true;
            return {...prevState, ...update};
        })
    }






    // private
    // private






    // public
    getUID() {
        return this._data["uid"];
    }
    getDisplayName() {
        return this._data["displayName"];
    }
    getIconURL() {
        return this._data["photoURL"];
    }
    // public
}



export default AccountInfo;