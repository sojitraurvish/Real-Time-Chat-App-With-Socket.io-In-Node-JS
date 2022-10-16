const socket=io();// In order get connected with server we call io() function

//now socket (variable) is going to allow to communicate with server and client too.

socket.on("countUpdated",(count)=>{
    console.log("The count has been updated!",count);
});

document.querySelector("#increment").addEventListener("click",()=>{
    console.log("clicked");
    socket.emit("increment");
});