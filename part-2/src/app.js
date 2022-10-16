const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require("socket.io");

const app=express();
const server=http.createServer(app);
const io=socketio(server);

app.use(express.static(path.join(process.cwd(),"public")));


io.on("connection",(socket)=>{
    console.log("Web socket connected...");

    let serverMessage="Welcome Urvish";
    socket.emit("message",serverMessage);

    socket.on('sendMessage',(message)=>{
        io.emit("message",message);
    })
});

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is created at port ${PORT}`);
})