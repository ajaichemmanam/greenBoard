import axios from 'axios';
import {serviceUrls} from 'connections/endpoints';

const Auth =  { 

  isAuthenticated : false,
  // isAdmin : false,
  // token:null,
  authenticate(username,password,callback) {
    // Remove when server is on, bypasses authentication
    // callback(true);

    // if(x === 'admin' && y === 'admin')
    // {
    // this.isAuthenticated = true;
    // callback(true);
    // }
    // else{
    //   callback(false);
    // }
    var data = {
      "username":username,
      "password":password
    }
axios.post(serviceUrls.authentication, data).then((res)=>{
if(res.status===200){
  if(res.data['isAuth']){

    // this.token = res.data.authToken
    // this.isAdmin = res.data.isAdmin
    this.isAuthenticated = res.data.isAuth
    // console.log("token",this.token)
    // console.log(res.data['isAdmin'])

    window.sessionStorage.setItem('username', res.data['username']);
    window.sessionStorage.setItem('isAdmin', res.data['isAdmin']);
    window.sessionStorage.setItem('jwtToken', res.data['authToken']);
    // this.sessionSet('username',res.data['username'])
    // this.sessionSet('isAdmin',res.data['isAdmin'])
    // this.sessionSet('jwtToken',res.data['jwtToken'])
    window.location.reload()
    callback(true);
  }
  else{
    console.log("Incorrect User Name/Password")
    callback(false);
  }
}
else{
  console.log("Network Issue", res.status)
  callback(false);
}

})
    
  },

  // //get session value
  sessionGet(key) {
    let stringValue = window.sessionStorage.getItem(key)
      if (stringValue !== null) {
        let value = JSON.parse(stringValue)
          let expirationDate = new Date(value.expirationDate)
          if (expirationDate > new Date()) {
            return value.value
          } else {
            window.sessionStorage.removeItem(key);
            window.location.reload();
          }
      }
      return null
  },

  // // add into session
  sessionSet(key, value, expirationInMin = 5) {
    let expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin))
    let newValue = {
      value: value,
      expirationDate: expirationDate.toISOString()
    }
    window.sessionStorage.setItem(key, JSON.stringify(newValue))
  },
  
  // authenticate(x,y,callback) {

  //   const hide = message.loading('Login in progress..', 0);
  //   // // console.log(message.getContainer());
  //   // message.config({
  //   //   top: 100,
  //   //   duration: 2,
  //   //   maxCount: 3,
  //   //   getContainer: () => document.body
  //   // });

  //   this.callLoginService(x,y).then(res=>{
  //     console.log(res);
  //     if(res.status === 200 || res.status === 201 || res.status === 204){

  //       const status = res.data['Status'];

  //       if( status === 200 ){
  //         let user = {};
  //         user.username = res.data['User'];
  //         user.token = res.data['Token'];
  //         this.isAuthenticated = true;
  //         hide();
  //         callback(true, user);

  //       }
  //       else{
  //         switch(status){

  //           case 401:
  //             console.log('Invalid Username or Password, please try again... ');
  //             hide();
  //             message.warning('Invalid Username or Password',2.5)
  //             break;
            
  //         }

  //         callback(false,null);

  //       }
                
        
  //     }
  //     else{

  //       switch(res.status){

  //         case '401':
  //           console.log('Invalid Username or Password, please try again... ');
  //           break;
  //         // case '403':
  //         //   console.log('User denied access, please contact admin... ');
  //         //   break;
  //         // case '406':
  //         //   console.log('Multiple failed attempts hack detected, account locked... ');
  //         //   break;
  //         default:
  //           console.log('Invalid Username or Password, please try again... ',res.data.Message);
  //           break;          

  //       }
  //       callback(false,null);
  //       hide();
  //       message.warning('Invalid Username or Password',2.5)
  //     }
      
  //   })
  //   .catch(e=>{
  //     callback(false,null);
  //     console.log('Error while calling Login Service',e);
  //     hide();
  //     message.error('Failed to Login',2.5)
  //   })
    
  // },

  // callLoginService(username,password){
  //   //console.log(username,password);
  //   let data = {
  //     Username:username,
  //     Password:password
  //   }
  //   //console.log('POST DATA',data);
  //   return axios.post(`${loginEndpoint}`,data,{headers: {'Content-Type':'application/json'}});
  // },
  signout() {
    window.sessionStorage.removeItem('jwtToken');
    window.sessionStorage.removeItem('username');
    window.sessionStorage.removeItem('auth');
    this.isAuthenticated = false;
    window.location.reload();
    // this.isAdmin = false;
    // this.token = null;
  }

};

export default Auth;