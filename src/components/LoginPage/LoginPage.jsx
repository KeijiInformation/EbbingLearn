import LogoImage from '../../assets/images/common/EbbingLearn-Logo.png';
import {Button} from '../common/Button';
import { signInWithGoogle } from '../../functions/authentication/login';


const LoginPage = (props) => {
    // ログイン処理関数ここから
    const handleSignin = () => {
        signInWithGoogle((result) => {
            // ログイン成功処理
            props.setAccountInfo(result.user);
            return true;
        }, () => {
            // ログイン失敗処理
            return false;
        });
    }
    // ログイン処理関数ここまで






    return (
        <div className="login-page-inner">
            <img src={LogoImage} alt="ロゴ画像" className="login-page-inner__logo-image" />
            <div className="login-page-inner__login-box">
                <p className="login-page-inner__login-box--instruction">ログインしてください</p>
                <Button
                    className="login-page-inner__login-box--login-btn btn"
                    text = {"ログインする"}
                    clickEvent = {handleSignin}
                />
                <p className="login-page-inner__login-box--note">googleアカウントを使用します</p>
            </div>
        </div>
    );
}

export default LoginPage;