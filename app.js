const express = require('express');
const { SERVER_PORT, GENDER } = require("./constants/app.constant");
const apiRouter = require("./routers/index")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${SERVER_PORT}`);
})