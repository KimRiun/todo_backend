const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const dotenv = require("dotenv");


// sequelize 연결
const {sequelize} = require("../models");
sequelize.sync({ force: false})
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(err => {
    console.error('DB 연결 실패:', err);
  });


dotenv.config();

const app = express();

app.use(cors());

// json 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());


app.use("/", require("./routes"));

app.use("*", (req, res) => {
    return res.status(404).json({message: "잘못된 경로입니다"});
  });


module.exports = functions
    .runWith({
        timeoutSeconds: 300,
        memory: "512MB",
    })
    .region('asia-northeast3') // 서울
    .https.onRequest(async (req, res) => {
            console.log("=== api:", req.headers, req.body, "===");
            return app(req, res);
    });



