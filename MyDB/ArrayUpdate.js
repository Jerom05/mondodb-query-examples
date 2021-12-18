const {MongoClient} = require("mongodb")
require('dotenv').config()

const connect = async()=>{
    const client = new MongoClient(process.env.DB_URI) 
    return await client.connect()
}

const insertDatabase = async()=>{
    const client = await connect()
    await client.db("Sample_Array").collection("my_array").insertMany(
        [
            {
              id:1,
              profession:"engineer",
              details:[
                {
                  id:01,
                  name:"Jerom",
                  fav:[
                      {
                          food:"chicken 1",
                          movie:"movie 1"
                      }
                  ]
                }
              ]
            },
            {
              id:2,
              profession:"engineer",
              details:[
                {
                  id:02,
                  name:"Calvin",
                  fav:[
                    {
                        food:"chicken 2",
                        movie:"movie 2"
                    }
                ]
                }
              ]
            }
          ]
    )
    client.close()
}

const updateArray = async()=>{
  const client = await connect()
  const cursor = await client.db("Sample_Array").collection("my_array").updateMany(
    {},
    {
      $set:{"details.$[elem].fav.$[fav]":{
        food: "foods 2",
        movie: "movies 2"
      }},

    },
    {
      arrayFilters:[{"elem.id":2},{"fav.food":"food 2"}]
    }
  )
  client.close()
}

// insertDatabase()
// updateArray()