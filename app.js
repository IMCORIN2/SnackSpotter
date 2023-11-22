const express = require('express')
const { SERVER_PORT, GENDER } = require("./constants/app.constant")
const app = express()
const db = require("./models/index.js")

const { Users } = db; 


// async function test() {
//   await Users.create({name:"test",email:"test",password:"test",gender:GENDER.man,birthday:"1995-11-21"})
//   const users = await Users.findAll()
// }
// test();

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${SERVER_PORT}`)
})