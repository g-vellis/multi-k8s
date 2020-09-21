/*
 * Primary logic for:
 *  - Connecting to Redis,
 *  - Watching for values, and then, eventually
 *  - Calculating our Fibonacci value
 */

// Redis connection keys
const keys = require("./keys");

// we import a redis client
const redis = require("redis");

// we create a Redis client
const redisClient = redis.createClient({
   host: keys.redisHost,
   port: keys.redisPort,
   // This is going to tell the redisClient we are using
   // that if it ever loses connection to our Redis server,
   // it should attempt to automatically reconnect to
   // the Redis server once every 1000 msec (i.e. 1sec).
   retry_strategy: () => 1000,
});

// sub stands for "subscription"
// duplicate()- >because this connection cannot be used for a purpose other than this.
const sub = redisClient.duplicate();

function fib(index) {
   if (index < 1) return 1;
   return fib(index - 1) + fib(index - 2);
}

/*
 * Puts the calculated value back to Redis.
 *
 * Watch Redis and get a message any time that a new value shows up.
 *
 * So, any time we get a new message, run this callback function that
 * we define here (i.e. second argument of the on() method).
 *
 * Every time we get a new value that shows up in Redis, we are going
 * to calculate a new Fibonacci value, and then insert that into
 * a hash called values or a Hash called "values" where the message
 * received is going to be the index, and the result of fib its value.
 *
 * message is the fibbonnacci array index whose fibonacci number we want to calculate.
 */
sub.on("message", (channel, message) => {
   // the hash key is going to be the fibonacci index, i.e. the message we received (inserted via the html-form).
   redisClient.hset("values", message, fib(parseInt(message)));
});

/*
 * Is notified when Redis Insertion events are triggered.
 *
 * Anytime someone INSERTS a new value into Redis,
 * we are going to get that value.
 * @arg "insert" stands for "insert" event.
 */
sub.subscribe("insert");
