const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        //additional properties no longer needed
        const conn = await mongoose.connect
        (process.env.MONGO_URI)
        

        console.log(`MongoDB connected: ${conn.connection.host})` )
    } catch (err){
        console.error(err)
        process.exits(1)
    }
}

module.exports = connectDB