const express = require('express')
const {MongoClient} = require("mongodb")
require('dotenv').config()
require('express-async-errors');

const client = new MongoClient(process.env.DB_URI)

const main = async()=>{
    try{
        await client.connect()
        // await listDatabases(client)
        // await createListing(client,{
        //     name:"Inserted One For Test"
        // }) 
        // await createMultipleListings(client, [{name:"inserted many one"},{name:"inserted many two"},{name:"inserted many three"}])
    }
    catch(err){
        console.log(err)
    }finally{
        await client.close()
    }
}

async function listDatabases(client){
    const databaseList = await client.db().admin().listDatabases()
    console.log('Databases')
    databaseList.databases.forEach(db=>{
        console.log(`- ${db.name}`)
    })
}

async function createListing(client, newListing){
    const result = await client.db("sample_airanb").collection("listingsAndReviews").insertOne(newListing)
    console.log(`New listing created with the following id: ${result.insertedId}`)
}

async function createMultipleListings(client, newListing){
    const result = await client.db("sample_airanb").collection("listingsAndReviews").insertMany(newListing)
    console.log(result.insertedIds)
}

const query = {
    $and:[
        {
            $or:[{"airline.id":1654},{"airline.id":470}],
        },
        {
            $or:[{"airline.iata":"CRG"},{"airline.iata":470}],
        }
    ],
}


 

main().catch(console.dir);

