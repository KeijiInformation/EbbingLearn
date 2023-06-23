import AccountInfo from "./AccountInfo";
import GoalsData from "./GoalsData";
import ProgressData from "./ProgressData";

class UserData {
    constructor(accountInfo, setLoadFlags) {
        this.account  = new AccountInfo(accountInfo, setLoadFlags);
        this.goals    = new GoalsData(this.account.getUID(), setLoadFlags);
        this.progress = new ProgressData(this.account.getUID(), setLoadFlags);
    }

    //////////////////////////////////////////////////////////////
    // update data
    //////////////////////////////////////////////////////////////
    async update() {
        await this.goals.delete(this.progress);
        await this.goals.cram();
    }
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
}



export default UserData;