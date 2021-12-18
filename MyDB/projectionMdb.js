const {MongoClient} = require("mongodb")
require('dotenv').config()

/**---------------------------------------------------------------------------------------\
 By default, queries in MongoDB return all fields in matching documents.                  |
 To limit the amount of data that MongoDB sends to applications,                          |
 You can include a projection document to specify or restrict fields to return.           |
 1 - include all the field                                                                |    
 0 - exclude the field                                                                    |
 #note : use only 1s or 0s. exprect only for _id [{ "address": 1, "_id": 0 })]            |
\----------------------------------------------------------------------------------------*/


const connect = async()=>{
    const client = new MongoClient(process.env.DB_URI) 
    return await client.connect()
}

// Insert Data
const Seed = async ()=>{
    const client = await connect()
    await client.db("MyDB").collection("projection").insertMany(
        [
            {
              item: 'journal',
              status: 'A',
              size: { h: 14, w: 21, uom: 'cm' },
              instock: [{ warehouse: 'A', qty: 5 }]
            },
            {
              item: 'notebook',
              status: 'A',
              size: { h: 8.5, w: 11, uom: 'in' },
              instock: [{ warehouse: 'C', qty: 5 }]
            },
            {
              item: 'paper',
              status: 'D',
              size: { h: 8.5, w: 11, uom: 'in' },
              instock: [{ warehouse: 'A', qty: 60 }]
            },
            {
              item: 'planner',
              status: 'D',
              size: { h: 22.85, w: 30, uom: 'cm' },
              instock: [{ warehouse: 'A', qty: 40 }]
            },
            {
              item: 'postcard',
              status: 'A',
              size: { h: 10, w: 15.25, uom: 'cm' },
              instock: [
                { warehouse: 'B', qty: 15 },
                { warehouse: 'C', qty: 35 }
              ]
            }
          ]
    )
}

//Return all fields in matching documents
const allFields = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status:'A'
    })
    const result = await cursor.toArray()
    console.log(result)
    client.close()
}

//Return specified fields and _id field only || _id field is return by defualt.
const projectEx1 = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status:'A'
    }).project({item: 1, status:1})
    const result = await cursor.toArray()
    console.log(result)
    client.close()
}

//Suppress _id Field
const projectEx2 = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status:'A'
    }).project({item: 1, status:1, _id:0})
    const result = await cursor.toArray()
    console.log(result)
    client.close()
}

//Return All But the Excluded Fields
const projectEx3 = async()=>{
    const client = await connect()

    const cursor = await client.db("MyDB").collection("projection").find({
        status:'A'
    }).project({ status: 0, instock: 0 })

    const result = await cursor.toArray()
    console.log(result)

    client.close()
}

// Return specific fields in embedded documents
const projectEx4 = async()=>{
    const client = await connect()

    const cursor = await client.db("MyDB").collection("projection").find({
        status:'A'
    })
    .project({item:1, status:1, 'size.uom':1})

    const result = await cursor.toArray()
    console.log(result)

    client.close()
}

//Suppress specific fields in Embedded documents
const projectEx5 = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status: 'A'
    })
    .project({ 'size.uom': 0 });

    const result = await cursor.toArray()
    console.log(result)

    client.close()
}

//Projection on Embedded Documents in an Array
const projectEx6 = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status: 'A'
    })
    .project({ item: 1, status: 1, 'instock.qty': 1 });

    const result = await cursor.toArray()
    console.log(result[0].instock)

    client.close()
}

// Project Specific Array Elements in the Returned 
// For fields that contain arrays, 
// MongoDB provides the following projection operators for manipulating arrays: $elemMatch, $slice, and $.

const projectExArr = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        instock:{$elemMatch:{qty:{$gt:5}}}
    })
    .project({ item: 1, status: 1, instock:{$elemMatch:{qty:{$gt:5}}} });

    const result = await cursor.toArray()
    console.log(result[2].instock)

    client.close()
}

//The following example uses the $slice projection operator to return the last element in the instock array:
const projectExArr1 = async()=>{
    const client = await connect()
    const cursor = await client.db("MyDB").collection("projection").find({
        status: 'A'
    })
    .project({ item: 1, status: 1, instock: { $slice: -1 } });

    const result = await cursor.toArray()
    console.log(result[2].instock)

    client.close()
}




// Function call querying data

// Seed()
// allFields()
// projectEx1()
// projectEx2()
// projectEx3()
// projectEx4()
// projectEx5()
// projectEx6()
// projectExArr()
projectExArr1()

