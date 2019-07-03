import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { Redirect } from "react-router-dom";

//Authorization
import Auth from "authorization/auth";
import libbase64 from "libbase64";

import Icon from "assets/img/reactlogo.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirectToReferrer: false,
      isValid: true
    };
  }
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    // console.log(element)
    element.addEventListener("keydown", e => {
      this.handleKeydown(e);
    });

    //Check if already logged
    // const loginExist = sessionStorage.getItem('auth');
    // if (loginExist === 'true') {
    //   Auth.isAuthenticated = true;
    //   this.setState({ redirectToReferrer: true });
    // }
    const loginExist = Auth.sessionGet("auth");
    if (loginExist) {
      Auth.isAuthenticated = true;
      this.setState({ redirectToReferrer: true });
    }

    //window.libbase64 = base64;
  }

  getEncodedUsernamePassword(username, password) {
    if (
      username &&
      password &&
      typeof username === "string" &&
      typeof password === "string"
    ) {
      const usernameb64 = libbase64.encode(username);
      const passwordb64 = libbase64.encode(password);
      return { username: usernameb64, password: passwordb64 };
    } else {
      return;
    }
  }

  handleKeydown(e) {
    if ((e.keyCode === 13) & (e.shiftKey === false)) {
      this.handleLogin();
    }
  }

  handleLogin() {
    //console.log(Auth.isAuthenticated);
    //console.log(this.state.username+this.state.password);
    const { username } = this.state;
    const { password } = this.state;

    if (username && password) {
      // let encoded = this.getEncodedUsernamePassword(username,password)

      Auth.authenticate(username, password, verified => {
        if (verified) {
          this.setState({ redirectToReferrer: true });
          //  console.log('Login Success',user);
          Auth.sessionSet("auth", true);
        } else {
          this.setState({ isValid: false });
        }
      });

      // let encoded = this.getEncodedUsernamePassword(username,password)
      // console.log('Base64',encoded);
    } else {
      this.setState({ isValid: false });
    }
  }

  changeUsername(e) {
    // this.setState({ username: e.target.value.toLowerCase() });
    this.setState({ username: e.target.value });
    if (e.target.value === "") {
      this.setState({ isValid: true });
    }
  }

  changePassword(e) {
    // this.setState({ password: e.target.value.toLowerCase() });
    this.setState({ password: e.target.value });
    if (e.target.value === "") {
      this.setState({ isValid: true });
    }
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/dashboard" }
    };
    const { redirectToReferrer } = this.state;

    const formControlClass = this.state.isValid
      ? "form-control"
      : "form-control is-invalid";

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="app flex-row align-items-center bg-white-100">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4 shadow" style={{ border: "none" }}>
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        className={formControlClass}
                        placeholder="Username"
                        onChange={e => this.changeUsername(e)}
                        required
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        className={formControlClass}
                        placeholder="Password"
                        onChange={e => this.changePassword(e)}
                        required
                      />
                      <div className="invalid-feedback">
                        Please provide a valid Username and Password
                      </div>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          onClick={() => this.handleLogin()}
                        >
                          Login
                        </Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none border-0"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <img
                        className="img-fluid img-avatar"
                        width={100}
                        src={Icon}
                        alt="logo"
                      />
                      <h2>Green Board</h2>
                      <p style={{ color: "white" }}>
                        This is an admin dashboard for Green Project
                      </p>

                      {/* <Link to = '/register'>
                      <Button color="primary" className="mt-3" active> Register Now! </Button>
                      </Link> */}
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;