const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "todo-list";

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) return console.log("Unable to connect to database");
    const db = client.db(databaseName);
    // db.collection("users").insertOne(
    //   {
    //     name: "Maahnoor"
    //   },
    //   (error, result) => {
    //     if (error) return console.log("unable to insert user");
    //
    //     console.log(result.ops);
    //   }
    // );

    db.collection("users").insertMany(
      [
        {
          name: "talat"
        },
        {
          name: "mansoor"
        }
      ],
      (err, res) => {
        if (err) return console.log({ error });

        console.log(res.ops);
      }
    );
  }
);
