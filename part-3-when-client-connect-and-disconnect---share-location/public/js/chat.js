const socket=io()// In order get connected with server we call io() function

//now socket (variable) is going to allow to communicate with server and client too.

socket.on("message",(message)=>{
    console.log(message);
});

document.querySelector("#message-form").addEventListener("submit",(e)=>{
    e.preventDefault();

    //document.querySelector("").value; 
    // input select by Tag name
    // #id select by id
    // .class select by class name 
    const message = e.target.elements.message.value;

    socket.emit("sendMessage",message);
})

document.querySelector("#send-location").addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    });
})