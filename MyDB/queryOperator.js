const exp = require('constants');
const express = require('express')
const {MongoClient} = require("mongodb")
require('dotenv').config()
require('express-async-errors');

const client = new MongoClient(process.env.DB_URI)

const main = async()=>{
    try{
        await client.connect()

        // const cursor = await client.db('Inventory').collection('inventory').find({
        //         status: 'A',
        //         qty: { $lt: 30 } 
        // });
        // await InsertMany(client)

        // const results = await cursor.toArray();
        // console.log(results)

        // await quiz(client)
        // await and(client)
        // await quizeQueryLogic(client)
        
        // await quizeQueryLogic1(client)
        // await expr(client)
        // await queryArr(client)
        // await queryAEx2(client)
        // await arrayWithProjection(client)
        // await ArrayElemMatch(client)
        // await ArrayElemMatch1(client)
        // await ArrayElemQuize(client)
        // await querySubDocument1(client)
        // await querySubDocument2(client)
        // await querySubDocument3(client)
        // await querySubDocument4(client)
        // await quizSubDocument(client)
        // await quizSubDocument2(client)
    }

    catch(err){
        console.log(err)
    }finally{
        await client.close()
    }
}

// $nor operator returns all the documents that not match with given query.
// Using $nor operator 
// Here returns all the des_ariport without "LED" and "UUA".
const nor = async (client)=>{
    const cursor = await client.db("sample_training").collection("routes").find({
        $nor:[{"dst_airport":"LED", "dst_airport":"UUA", }]
    })
    const result = await cursor.toArray()
    console.log(result)
}

// $and operator returns documents when all the given "and conditions" are satisfied.
// Using $and operator, $and operator is giving by default 
const and = async (client)=>{
    const cursor1 = await client.db("sample_training").collection("grades").find({
        student_id: {$gt:25, $lt:100}
    })
    // const result = await cursor1.toArray()

    const cursor2 = await client.db("sample_training").collection("routes").find({
        $and:[ {$or:[{dst_airport:'KZN'}, {src_airport:'KZN'}]}, {$or:[{airplane:"CR7"}, {airplane:"A81"}]} ]
    })
    const result = await cursor2.toArray() 
    console.log(result)
}

// default and operators
const quizeQueryLogic = async(client) =>{
    const cursor = await client.db("sample_training").collection("inspections").find({
        result:"Out of Business",
        sector:"Home Improvement Contractor - 100"
    })
    const result = await cursor.toArray()
    console.log(result.length)
}

// query practice with and or operator both
const quizeQueryLogic1 = async(client) =>{
    const cursor = await client.db("sample_training").collection("companies").find({
        $or:[
            {
                $and:[{founded_year:2004},{$or:[{category_code:"web"},{category_code:"social"}]}]
            },
            {
                $and:[{founded_month:10},{$or:[{category_code:"web"},{category_code:"social"}]}]
            }
        ]
    })
    
    const result = await cursor.toArray()
    console.log(result.length)
}

// quize practice
const quiz = async(client)=>{
    const cursor = await client.db("sample_training").collection("trips").find({
        "birth year":{$gt:1998}
    })
    const result = await cursor.toArray()
    console.log(result.length)
}

// $exper operator
const expr = async(client)=>{
    const cursor = await client.db("sample_training").collection("companies").find({
        "$expr":{"$eq":["$permalink", "$twitter_username"]}
    })
    const result = await cursor.toArray()
    console.log(result.length)
}

// $expr example two
const expr2 = async(client)=>{
    const cursor = await client.db("sample_training").collection("trips").find({
        "$expr":{
            "$and":[
                {"$gt":["$tripduration", 12000]},
                {"$eq":["$start station id", "$end station id"]}
            ]
        }
    })
    const result = await cursor.toArray()
    console.log(result)
}


// querying documents by it's array field using of array operator
const queryArr = async(client) =>{
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        amenities: "Iron"
    })
    const result = await cursor.toArray()
    console.log(result)
}

// array $size and $all operator
const queryAEx = async(client) =>{
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        $and:[
            {accommodates:{$gt:6}},
            {reviews:{
                $size:50
            }}
        ]
    })
    const result = await cursor.toArray()
    console.log(result)
}

const queryAEx2 = async(client) =>{
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        $and:[
            {property_type:"House"},
            {amenities:"Changing table"}
        ]
    })
    const result = await cursor.toArray()
    console.log(result.length)
}

// Array operator and Projection
const arrayWithProjection = async(client) =>{
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find(
        { "amenities":
        { "$size": 20, "$all": [ "Internet", "Wifi",  "Kitchen", "Heating",
                                 "Family/kid friendly", "Washer", "Dryer",
                                 "Essentials", "Shampoo", "Hangers",
                                 "Hair dryer", "Iron",
                                 "Laptop friendly workspace" ] } 
                                }
                    ).project( {"price": 1, "address": 1})
    const result = await cursor.toArray()
    console.log(result)
}

// $elemMatch with Projects only the array elements with at least one element that matches the specified criteria.
const ArrayElemMatch = async(client)=>{
    const cursor = await client.db("sample_training").collection("grades").find(
        { "class_id": 431 },
    ).project({
        "scores":{
            $elemMatch:{
                "score": { "$gt": 85 }
            }
        }
    })
    const result = await cursor.toArray()
    console.log(result[4].scores)
}

// quiz
const ArrayElemQuize = async(client)=>{
    const cursor = await client.db("sample_training").collection("companies").find({
        offices:{
            $elemMatch:{city:"Seattle"}
        }
    })
    const result = await cursor.toArray()
    console.log(result.length)
}
// 52cdef7c4bab8bd675297d8a

//Query sub documents 

const querySubDocument1 = async(client)=>{
    const cursor = await client.db("sample_training").collection("trips").find({
        "start station location.type":"Point"
    })
    const result =await cursor.toArray()
    console.log(result)
}

const querySubDocument2 = async(client)=>{
    const cursor = await client.db("sample_training").collection("companies").find({
        "relationships.0.person.last_name": "Zuckerberg"
    }).project({name:1})

    const result = await cursor.toArray()
    console.log(result)
}

const querySubDocument3 = async(client)=>{
    const cursor = await client.db("sample_training").collection("companies").find({
        "relationships.0.person.first_name": "Mark",
        "relationships.0.title": {"$regex": "CEO" } 
    }).project({name:1})

    const result = await cursor.toArray()
    console.log(result)
}

const querySubDocument4 = async(client)=>{
    const cursor = await client.db("sample_training").collection("companies").find({
      "relationships":{
          $elemMatch:{
            "is_past": true,
            "person.first_name": "Mark" 
          }
      }
    }).project({name:1})

    const result = await cursor.toArray()
    console.log(result.length)
}

const quizSubDocument = async(client)=>{
    const cursor = await client.db("sample_training").collection("trips").find({
        "start station location.coordinates.0":{
             "$lt": -74 
        }
    })
    const result =await cursor.toArray()
    console.log(result.length)
}

const quizSubDocument2 = async(client)=>{
    const cursor = await client.db("sample_training").collection("inspections").find({
        "address.city": "NEW YORK"
    })
    const result =await cursor.toArray()
    console.log(result.length)
}


async function InsertMany(client){
    const res =  await client.db("Inventory").collection('inventory').insertMany([
        {
          item: 'journal',
          instock: [
            { warehouse: 'A', qty: 5 },
            { warehouse: 'C', qty: 15 }
          ]
        },
        {
          item: 'notebook',
          instock: [{ warehouse: 'C', qty: 5 }]
        },
        {
          item: 'paper',
          instock: [
            { warehouse: 'A', qty: 60 },
            { warehouse: 'B', qty: 15 }
          ]
        },
        {
          item: 'planner',
          instock: [
            { warehouse: 'A', qty: 40 },
            { warehouse: 'B', qty: 5 }
          ]
        },
        {
          item: 'postcard',
          instock: [
            { warehouse: 'B', qty: 15 },
            { warehouse: 'C', qty: 35 }
          ]
        }
      ])
}

main().catch(console.dir);







/**
Query Operators - Comparison

1. How many documents in the sample_training.zips collection have fewer than
   1000 people listed in the pop field?

2. What is the difference between the number of people born in 1998 and the
   number of people born after 1998 in the sample_training.trips collection?

3. Using the sample_training.routes collection find out which of the
   following statements will return all routes that have at least one stop
   in them?

        -  db.routes.find({ "stops": { "$gt": 0 }}).pretty()
        -  db.routes.find({ "stops": { "$gte": 0 }}).pretty()
        -  db.routes.find({ "stops": { "$ne": 0 }}).pretty()
        -  db.routes.find({ "stops": { "$lt": 10 }}).pretty()


Query Operators - Logic

1. How many businesses in the sample_training.inspections dataset have the
   inspection result "Out of Business" and belong to the Home Improvement
   Contractor - 100 sector?
2. How many zips in the sample_training.zips dataset are neither over-
   populated nor under-populated?

   In this case, we consider population over 1,000,000 to be over-populated
   and under 5,000 to be under-populated.
3. How many companies in the sample_training.companies dataset were either
   founded in 2004, or in the month of October and either have the social
   category_code or web category_code?

Expressive Query Operator

How many companies in the sample_training.companies collection have the same
permalink as their twitter_username?

Array Operators

1. What is the name of the listing in the sample_airbnb.listingsAndReviews
   dataset accommodate more than 6 people and has exactly 50 reviews?
2. How many documents have the property_type House, and include Changing
   table as one of the amenities?

Array Operators and Projection

How many companies in the sample_training.companies collection have offices
in the city of Seattle?

Array Operators and Sub-Documents

1. Latitude decreases in value as you move west.

   How many trips in the sample_training.trips collection started at
   stations that are to the west of the -74 latitude coordinate?
2. How many inspections from the sample_training.inspections collection were
   conducted in the city of New York?


Query Operators - Comparison

1. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was not "Subscriber"
2. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was "Customer" using a redundant equality operator.
3. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was "Customer" using the implicit equality operator.


Query Operators - Logic

Find all documents where airplanes CR2 or A81 left or landed in the KZN
airport.

Expressive Query Operator

1. Find all documents where the trip started and ended at the same station.
2. Find all documents where the trip lasted longer than 1200 seconds, and
   started and ended at the same station.

Array Operators

1. Find all documents that contain more than one amenity without caring
   about the order of array elements.
2. Only return documents that list exactly 20 amenities in this field and
   contain the amenities of your choosing.

Array Operators and Projection

1. Find all documents in the sample_airbnb database with exactly 20
   amenities which include all the amenities listed in the query array, and display their price and address.
2. Find all documents in the sample_airbnb database that have Wifi as one of
   the amenities only include price and address in the resulting cursor.
3. Find all documents in the sample_airbnb database that have Wifi as one of
   the amenities only include price and address in the resulting cursor,
   also exclude "maximum_nights".
   Was this operation successful? Why?
4. Find all documents in the grades collection where the student in class
   431 received a grade higher than 85 for any type of assignment.
5. Find all documents in the grades collection where the student had an
   extra credit score.

Array Operators and Sub-Documents

1. Find any document from the companies collection where the last name
   Zuckerberg in the first element of the relationships array.
2. Find how many documents from the companies collection have CEOs who's
   first name is Mark and who are listed as the first relationship in this
   array for their company entry.
3. Find all documents in the companies collection where people named Mark
   used to be in the senior company leadership array, a.k.a the
   relationships array, but are no longer with the company.


 */