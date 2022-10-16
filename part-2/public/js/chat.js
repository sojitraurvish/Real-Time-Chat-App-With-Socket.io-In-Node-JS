const socket=io()

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