// Note
// emit -> is used to call the event or register event and through the data and send acknowledgement function
// on   -> is used to access that data and .on method is listen particular event
// io   -> is used to give changes to every client
// socket -> is used to give changes to only one particular connected client 
// socket.broadcast.emit -> this will send message to every connected client except that particular client or socket
        // For All                    |     For specific room
        // socket.emit                |
        // socket.broadcast.emit()    |     socket.broadcast.to().emit() (every one in room except for specific client)
        // io.emit()                  |     io.to().emit() - (every body in specific room)
const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require("socket.io");
const Filter=require("bad-words");
const {generateMessage,genrateLocation}=require("./utils/messages");
const {addUser,removeUser,getUser,getUsersInRoom}=require("./utils/users");

const app=express();
const server=http.createServer(app);//Note here express also create server for us and it use http module behind the seen but socket io require http module to configure it self that's why we create server with http module
const io=socketio(server);//configuring socket to work with it 

app.use(express.static(path.join(process.cwd(),"public")));


io.on("connection",(socket)=>{// this function will run when every new client get connected to server and on function is used to listen and react on same event And in order call this function from frontend you have to use io()
    console.log("Web socket connected...");


    socket.on("join",({username,room},acknowledgementCallback)=>{//{username,room} or options

        const {error,user}=addUser({id:socket.id,username,room});//here username,room or ...options

        if(error){
            return acknowledgementCallback(error);
        }


        socket.join(user.room)//allow user to join room

        socket.emit("message",generateMessage("Admin","Welcome"));//Now when user get connected i want to send new event to client and emit function is used to register new event
        socket.broadcast.to(user.room).emit("message",generateMessage("Admin",`${user.username} has joined!`))//this will send message to every connected client except that particular client or socket

        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        acknowledgementCallback();
        // For All                    |     For specific room
        // socket.emit                |
        // socket.broadcast.emit()    |     socket.broadcast.to().emit() (every one in room except for specific client)
        // io.emit()                  |     io.to().emit() - (every body in specific room)
    })

    socket.on('sendMessage',(message,acknowledgementCallback)=>{

        const user= getUser(socket.id);

        const filter=new Filter();

        if(filter.isProfane(message)){
            return acknowledgementCallback("Profanity is not allowed!");
        }

        // socket.emit("countUpdated",count); for single client or particular connection
        io.to(user.room).emit("message",generateMessage(user.username,message));//emitting to every connection or every client 
        acknowledgementCallback("Delivered!");//acknowledgement callback to client
    })

    socket.on("sendLocation",(coords,acknowledgementCallback)=>{
        const user= getUser(socket.id);

        io.to(user.room).emit("locationMessage",genrateLocation(user.username,coords));
        acknowledgementCallback();
    });

    //when some client or socket get disconnected 
    //NOTE - 1 ) connection 2) disconnect these are built in events so we don't need to emit both at client side it all thing will be done by socket.io library
    socket.on("disconnect",()=>{
        const user= removeUser(socket.id);

        if(user){
            // socket.broadcast.emit("message",generateMessage("A get dis connected!")); 
            io.to(user.room).emit("message",generateMessage(`${user.username} has left!`));

            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

        
    });
});

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Server is created at port ${PORT}`);
})