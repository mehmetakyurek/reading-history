import classes from "./styles/Login.module.scss"
import { Component, FC, PropsWithChildren } from "react";
import cn from "classnames"
import TitleBar from "./TitleBar";
import { CreateUser, FileExists, IsEncrypted, Login} from "../../wailsjs/go/main/App"

export default class AppLogin extends Component<PropsWithChildren<{}>, { val: string, auth: boolean, fileExists?: boolean, isEncrypted?: boolean }> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = {
      auth: false,
      val: ""
    }
  }

  async componentDidMount() {
    this.setState({
      fileExists: await FileExists(),
      isEncrypted: await IsEncrypted()
    })
  }

  render() {
    return (this.state.auth || (this.state.fileExists === true && this.state.isEncrypted === false)) ?
      <>{this.props.children}</> :
      <div className={cn(classes.container)}>
        <Loading enable={this.state.fileExists === undefined || this.state.isEncrypted === undefined} />
        <TitleBar page="Login" />
        <div className={classes.bg}></div>
        <div className={cn(classes["login-box"], { [classes.newUser]: this.state.fileExists === false })}>
          <div className={classes.password}>
            <div className={classes["welcome-text"]}>
              {this.state.fileExists === true ? "Welcome" : "Create Password"}
            </div>
            <input type="password" className={classes["login-password"]} value={this.state.val} onChange={e => this.setState({ val: e.currentTarget.value })} />
            <div className={classes["login-button"]} onClick={async () => {
              if (this.state.val.length >= 4) {
                if (this.state.fileExists) {
                  const login = await Login(this.state.val)
                  this.setState({ auth: login })
                } else if (await CreateUser(this.state.val)) {
                  this.setState({ auth: true })
                }

              }
            }}>
              Login
            </div>
          </div>
          {!this.state.fileExists && <div className={classes.noPassword}>
            <div className={classes['login-button']} onClick={async () => {
              if ((await CreateUser(""))) {
                this.setState({
                  auth: true
                })
              }
            }}>Continue without password</div>
            <ul className={classes.noPwdWarning}>
              <li>App can be opened without password</li>
              <li>Data won't be encrypted</li>
            </ul>
          </div>}
        </div>
      </div>
  }
}

const Loading: FC<{ enable: boolean }> = (props) => {
  return !props.enable ? <></> : <div className={classes.loginLoading}>Loading...</div>
}