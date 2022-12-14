const generateMessage=(text)=>{
    return {
        text,
        createdAt:new Date().getTime()
    }
}

const genrateLocation=(coords)=>{
    return {
        url:`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    genrateLocation
}