import LoginController from './LoginController'
import RegisteredUserController from './RegisteredUserController'
import EmailVerificationController from './EmailVerificationController'
const Auth = {
    LoginController: Object.assign(LoginController, LoginController),
RegisteredUserController: Object.assign(RegisteredUserController, RegisteredUserController),
EmailVerificationController: Object.assign(EmailVerificationController, EmailVerificationController),
}

export default Auth