const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json()); // marshals Http POST request body TO json.

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
   user: keys.pgUser,
   host: keys.pgHost,
   database: keys.pgDatabase,
   password: keys.pgPassword,
   port: keys.pgPort,
});
pgClient.on("connect", () => {
   pgClient
      .query("CREATE TABLE IF NOT EXISTS values(number INT)")
      .catch((err) => console.log(err));
});

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
   host: keys.redisHost,
   port: keys.redisPort,
   retry_strategy: () => 1000, // if we ever lose connection to Redis, try to reconnect to it once every second.
});
// // duplicate()- > because this connection cannot be used for a purpose other than this.
const redisPublisher = redisClient.duplicate();

// Express router handlers

app.get("/", (req, resp) => {
   resp.send("Hi");
});

/*
 * returns all of the values that have ever been submitted
 * to our application
 */
app.get("/values/all", async (req, resp) => {
   const values = await pgClient.query("SELECT * from values");

   resp.send(values.rows);
});

app.get("/values/current", async (req, resp) => {
   /*
    * Unfortunately the Redis library for Node.js does not have
    * out-of-the-box promise support which is why we have to use
    * callbacks as opposed to making use of the nice async-await syntax (see e.g.: get("values/all") function).
    */
   // hgetall  -> essentially means, look at a hash value inside the Redis instance
   // and just get all the information from it.
   // The hash we are going to look at, is called: "values".
   redisClient.hgetall("values", (err, values) => {
      resp.send(values); // the information related to the "values" key we are searching.
   });
});

/*
 * This is going to receive values from our React application.
 */
app.post("/values", async (req, resp) => {
   // the fibonnacci table index that the user submitted.
   const index = req.body.index;

   if (parseInt(index) > 40) return resp.status(422).send("Index too high");

   /*
    * Eventually, the Worker is going to come to the hash that we are creating
    * inside of Redis and it is going to replace this "Nothing yet!" string
    * with the actual calculated (fibonnacci) value.
    */
   redisClient.hset("values", index, "Nothing yet!");
   /*
    * This is going to wake up the Worker process and say: "hey it is time to pull
    * a new value out of Redis and start calculating the Fibonacci value for it".
    */
   redisPublisher.publish("insert", index);

   // This is going to take the submitted index and permanently store it inside of Postgresql
   pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

   resp.send({ working: true });
});

app.listen(5000, (err) => {
   console.log("Listening");
});
