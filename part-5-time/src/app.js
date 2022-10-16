// Note
// emit -> is used to call the event or register event and through the data and send acknowledgement function
// on   -> is used to access that data and .on method is listen particular event
// io   -> is used to give changes to every client
// socket -> is used to give changes to only one particular connected client 
// socket.broadcast.emit -> this will send message to every connected client except that particular client or socket
const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require("socket.io");
const Filter=require("bad-words");
const {generateMessage,genrateLocation}=require("./utils/messages");

const app=express();
const server=http.createServer(app);//Note here express also create server for us and it use http module behind the seen but socket io require http module to configure it self that's why we create server with http module
const io=socketio(server);//configuring socket to work with it 

app.use(express.static(path.join(process.cwd(),"public")));


io.on("connection",(socket)=>{// this function will run when every new client get connected to server and on function is used to listen and react on same event And in order call this function from frontend you have to use io()
    console.log("Web socket connected...");

    
    socket.emit("message",generateMessage("Welcome"));//Now when user get connected i want to send new event to client and emit function is used to register new event
    socket.broadcast.emit("message",generateMessage("A new user has joind!"))//this will send message to every connected client except that particular client or socket

    

    socket.on('sendMessage',(message,acknowledgementCallback)=>{

        const filter=new Filter();

        if(filter.isProfane(message)){
            return acknowledgementCallback("Profanity is not allowed!");
        }

        // socket.emit("countUpdated",count); for single client or particular connection
        io.emit("message",generateMessage(message));//emitting to every connection or every client 
        acknowledgementCallback("Delivered!");//acknowledgement callback to client
    })

    socket.on("sendLocation",(coords,acknowledgementCallback)=>{
        io.emit("locationMessage",genrateLocation(coords));
        acknowledgementCallback();
    });

    //when some client or socket get disconnected 
    //NOTE - 1 ) connection 2) disconnect these are built in events so we don't need to emit both at client side it all thing will be done by socket.io library
    socket.on("disconnect",()=>{
        socket.broadcast.emit("message",generateMessage("A get dis connected!")); 
        // io.emit("message","A get dis connected!");
    });
});

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is created at port ${PORT}`);
})