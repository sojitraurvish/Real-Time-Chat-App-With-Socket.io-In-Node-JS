// Note
// emit -> is used to call the event or register event and through the data 
// on   -> is used to access that data and .on method is listen particular event
// io   -> is used to give changes to every client
// socket -> is used to give changes to only one particular connected client 
const path=require("path");
const http=require("http");
const express=require("express");
const socketio=require("socket.io");

const app=express();
const server=http.createServer(app);//Note here express also create server for us and it use http module behind the seen but socket io require http module to configure it self that's why we create server with http module 
const io=socketio(server);//configuring socket to work with it
 
const port=process.env.PORT || 3000;
const publicDirectoryPath=path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath)); 

let count=0;

io.on("connection",(socket)=>{// this function will run when every new client get connected to server and on function is used to listen and react on same event
    console.log("New Websocket Connection");
    
    //Now when user get connected i want to send new event to client and emit function is used to register new event
    socket.emit("countUpdated",count);

    socket.on("increment",()=>{
        count++;
        // socket.emit("countUpdated",count); for single client or particular connection
        io.emit("countUpdated",count);//emitting to every connection or every client
    })
});

server.listen(port,()=>{
    console.log(`Server is started on port ${port}`);
});

