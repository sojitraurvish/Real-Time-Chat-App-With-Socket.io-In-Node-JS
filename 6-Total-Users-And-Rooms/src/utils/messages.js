const generateMessage=(username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const genrateLocation=(username,coords)=>{
    return {
        username,
        url:`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    genrateLocation
}