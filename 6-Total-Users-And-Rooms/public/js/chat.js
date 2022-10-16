const socket=io()// In order get connected with server we call io() function

//now socket (variable) is going to allow to communicate with server and client too.

// Elements
const $messageForm=document.querySelector("#message-form")
const $messageFormInput=$messageForm.querySelector("input")
const $messageFormButton=$messageForm.querySelector("button")
const $sendLocationButton=document.querySelector("#send-location")
const $messages=document.querySelector("#messages");

// Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector("#location-template").innerHTML
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML

// Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on("message",(message)=>{
    console.log(message);
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm a")

    });
    $messages.insertAdjacentHTML("beforeend",html);
});

socket.on("locationMessage",(message)=>{
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend",html);
});

socket.on("roomData",({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector("#sidebar").innerHTML=html;
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    // disable send button 
    $messageFormButton.setAttribute("disabled",true);

    //document.querySelector("").value; 
    // input select by Tag name
    // #id select by id
    // .class select by class name 
    const message = e.target.elements.message.value;

    socket.emit("sendMessage",message,(message)=>{//acknowledgement callback from server
        //enable send button
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value="";
        $messageFormInput.focus()

        console.log("Message delivered successfully...");
        console.log(message);
    });
})

$sendLocationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }


    // disable send button 
    $sendLocationButton.setAttribute("disabled",true);

    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            //enable send button
            $sendLocationButton.removeAttribute("disabled");
            console.log("Location Shared");
        });
    });
})



socket.emit("join",{username,room},(error)=>{
      if(error){
        alert(error);
        location.href="/"
      }
})