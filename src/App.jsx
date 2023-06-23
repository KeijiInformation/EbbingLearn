import './App.css';
import { useEffect, useState, createContext } from 'react';
import { Header, LoginPage, DoPage, ConfirmPage, RegisterPage, Footer } from './components/index'
import { onAuthStateChanged } from './functions/authentication/login'
import { auth } from './firebase';
import { UserData} from "./userData/index";
import { DateData, TaskVariables} from './GlobalVariable/index';

// cssのインポートここから
import "./assets/styles/common/reset.scss";
import "./assets/styles/common/common.scss";
import "./assets/styles/common/Header.scss";
import "./assets/styles/LoginPage/LoginPage.scss";
import "./assets/styles/DoPage/DoPage.scss";
import "./assets/styles/ConfirmPage/ConfirmPage.scss";
import "./assets/styles/RegisterPage/RegisterPage.scss";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
// cssのインポートここまで






/////////////////////////////////////////////////////////////////
// global variables
/////////////////////////////////////////////////////////////////
const UserDataContext = createContext({
	"Goals": undefined,
	"Progress": undefined,
	"Account": undefined,
});
const DateDataContext = createContext(new DateData());
const TaskVariablesContext = createContext(new TaskVariables());
let storage = getStorage();
let NoImageURLContext;
getDownloadURL(ref(storage, "images/noImage.png")).then(result => {
	NoImageURLContext = createContext(result);
})
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////






function App() {
	const debugMode = false;
	/////////////////////////////////////////////////////////////////
	// set state
	/////////////////////////////////////////////////////////////////
	const [pageState, setPageState] = useState('login');
	const [userData, setUserData] = useState({
		"Account": undefined,
		"Goals": undefined,
		"Progress": undefined,
	})
	const [loadFlags, setLoadFlags] = useState({"Account": false, "Goals": false, "Progress": false});
	const [reloadFlags, setReloadFlags] = useState({"Goals": false, "Progress": false});
	const [accountInfo, setAccountInfo] = useState({});
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////






	/////////////////////////////////////////////////////////////////
	// login state admin
	/////////////////////////////////////////////////////////////////
	onAuthStateChanged(auth, (user) => {
		if (!user) {
			setPageState("login");
		}
	});
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////






	/////////////////////////////////////////////////////////////////
	// load data
	/////////////////////////////////////////////////////////////////
	useEffect(() => {
		if (Object.keys(accountInfo).length !== 0) {
			setAccountInfo(auth.currentUser);
			setUserData(() => {
				// const accountData  = new AccountInfo(auth.currentUser, setLoadFlags);
				// const goalsData    = new GoalsData(accountData.getUID(), setLoadFlags);
				// const progressData = new ProgressData(accountData.getUID(), setLoadFlags);
				const userData     = new UserData(auth.currentUser, setLoadFlags);
				return {"Account": userData.account, "Goals": userData.goals, "Progress": userData.progress, "UserData": userData};
			})
		} else if (debugMode) {
			setUserData(() => {
				// const accountData  = new AccountInfo({"uid": "swA5RJ6a9gcj5egzNfHnS9CqWie2"}, setLoadFlags);
				// const goalsData    = new GoalsData(accountData.getUID(), setLoadFlags);
				// const progressData = new ProgressData(accountData.getUID(), setLoadFlags);
				const userData     = new UserData({"uid": "swA5RJ6a9gcj5egzNfHnS9CqWie2"}, setLoadFlags);
				return {"Account": userData.account, "Goals": userData.goals, "Progress": userData.progress, "UserData": userData};
			})
		} else {
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		if (!Object.values(loadFlags).includes(false)) {
			if (pageState === "login") {
				setPageState("do");
			}
		}
	}, [loadFlags]);

	useEffect(() => {
		let isChanged = false;
		let updated = {}
		Object.keys(reloadFlags).forEach(target => {
			if (reloadFlags[target]) {
				userData[target].reload(setLoadFlags);
				isChanged = true;
			}
			updated[target] = false;
		})
		if (isChanged) {
			setReloadFlags({...updated});
		}
	}, [reloadFlags])
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////






	/////////////////////////////////////////////////////////////////
	// reload and update
	/////////////////////////////////////////////////////////////////
	useEffect(() => {
		if (pageState !== "login" && pageState !== "register") {
			userData["UserData"].update();
		}
	}, [pageState])
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////






	/////////////////////////////////////////////////////////////////
	// render
	/////////////////////////////////////////////////////////////////
	if (pageState === "login") {
		return (
			<>
				<div className="page-content">
					<LoginPage
						setAccountInfo={setAccountInfo}
					/>
				</div>
				<Footer></Footer>
			</>
		);
	} else {
		return (
			<UserDataContext.Provider value={userData}>
				<Header
					accountInfo  = {accountInfo}
					setPageState = {setPageState}
				/>
				<div className="page-content">
					{pageState==="do" &&
						<DoPage
							setReloadFlags = {setReloadFlags}
						/>
					}
					{pageState==="confirm" &&
						<ConfirmPage
							setReloadFlags = {setReloadFlags}
						/>
					}
					{pageState==="register" &&
						<RegisterPage
							setReloadFlags = {setReloadFlags}
							setPageState   = {setPageState}
							pageState      = {pageState}
						/>
					}
					{/* <CSSTransition
						in = {pageState === "do"}
						timeout = {600}
						unmountOnExit
					>
						<DoPage
							setReloadFlags = {setReloadFlags}
						/>
					</CSSTransition>


					<CSSTransition
						in = {pageState === "confirm"}
						timeout = {600}
						unmountOnExit
					>
						<ConfirmPage
							setReloadFlags = {setReloadFlags}
						/>
					</CSSTransition>


					<CSSTransition
						in = {pageState === "register"}
						timeout = {600}
						unmountOnExit
					>
						<RegisterPage
							setReloadFlags = {setReloadFlags}
							setPageState   = {setPageState}
							pageState      = {pageState}
						/>
					</CSSTransition> */}
				</div>
				<Footer></Footer>
			</UserDataContext.Provider>
		);
	}
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
}



export { App, UserDataContext, DateDataContext, TaskVariablesContext, NoImageURLContext };