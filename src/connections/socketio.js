// // import openSocket from "socket.io-client";
// // const socket = openSocket("http://localhost:5000/");

// import io from 'socket.io-client';
// const socket  = io('http://localhost:5000/devices');
// function connect(id, cb) {
//   if(id === false){
//     socket.close()
//   } 
//   // listen for any messages coming through
//   // of type 'data' and then trigger the
//   // callback function with said message
//   socket.on("responseMessage", message => {
//     // console.log the message for posterity
//     // console.log(message);
//     // trigger the callback passed in when
//     // our App component calls connect
//     cb(message);
//   });
// }

// export { connect };