const {MongoClient} = require("mongodb")
require('dotenv').config()

const connect = async()=>{
    const client = new MongoClient(process.env.DB_URI) 
    return await client.connect()
}

//Return all fields in matching documents
const projectExArr1 = async()=>{
    const client = await connect()

    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").aggregate([
        {
            $match:{
                "room_type":'Apartment'
            }
        }
    ])
    const result = await cursor.toArray()
    console.log(result.length)

    client.close()
}

projectExArr1()