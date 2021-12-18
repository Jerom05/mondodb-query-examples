let eleme = {
    offices:{
      $elemMatch:{
        zip_code:{
          $ne:"9810"
        }
      }
    }
} //not working properly  

let elem2 =  {
    $and:[
      {"offices.zip_code":{$ne:"9810"}} 
      ]
} // working properly



const sample_database = {
  arrary=[
    {
      id:1,
      obj:[
        {
          id:01,
          name:"Jerom"
        }
      ]
    },
    {
      id:2,
      obj:[
        {
          id:02,
          name:"Calvin"
        }
      ]
    }
  ]
}