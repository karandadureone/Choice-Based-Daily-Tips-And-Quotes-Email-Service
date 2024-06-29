const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const { spawn } = require("child_process");

const app = express();
const Port = 3001;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "karan",
  password: "Karan@123",
  database: "scrapped"
});

app.use(bodyParser.json());
app.use(cors());

app.get("/getTopics", (req, res) => {
  console.log("gettopic started")
  const query = `
    SELECT DISTINCT(genre) from quotes
    `

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    connection.query(query, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      const result = []
      for (let i = 0; i < results.length; i++) {
        result.push(results[i].genre);
      }
      console.log(result);
      res.json(result);
    });
  })
})

app.post("/subscribe", (req, res) => {
  const { email, topics } = req.body.subscriptionData;
  console.log(email, topics)
  // console.log(req.body.subscriptionData)
  // let topic[]= topics;
  // for(i = 0;i < topics.length; i++){
  //   topic += topics[i] + ",";
  // }
  // console.log(topic);
  const query = `
    INSERT INTO user_master (email,topics)
VALUES (?,?)
ON DUPLICATE KEY UPDATE
    topics = values(topics);
`
   pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    connection.query(query, [email, JSON.stringify(topics)], (err, results) => {
      // connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.json(results);
    });

    connection.query("SET @row_index := 0;", (err, results) => {
      // connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    });

    connection.query(" UPDATE user_master SET id = (@row_index := @row_index + 1) ORDER BY id;", (err, results) => {
      connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    });
  });
});

app.post("/unsubscribe", (req, res) => {
  const { email, topics } = req.body.subscriptionData;
  if (!topics || topics.length === 0) {  // Check if topics array is empty or undefined
    const deleteQuery = "DELETE FROM user_master WHERE email = ?";
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      connection.query(deleteQuery, [email], (err, results) => {
        // connection.release();
        if (err) {
          console.error("Error querying database:", err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
        res.json(results);
      });
    connection.query("SET @row_index := 0;", (err, results) => {
      // connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    });

    connection.query(" UPDATE user_master SET id = (@row_index := @row_index + 1) ORDER BY id;", (err, results) => {
      connection.release();
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    });
  });
  } else {
    const upsertQuery = `
        INSERT INTO user_master (email, topics)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            topics = VALUES(topics);`
      ;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      connection.query(upsertQuery, [email, JSON.stringify(topics)], (err, results) => {
        connection.release();
        if (err) {
          console.error("Error querying database:", err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
        res.json(results);
      });
    });
  }
  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.error("Error getting MySQL connection:", err);
  //     res.status(500).json({ message: "Internal server error" });
  //     return;
  //   }
  //   connection.query(query, [ email], (err, results) => {
  //     connection.release(); 
  //     if (err) {
  //       console.error("Error querying database:", err);
  //       res.status(500).json({ message: "Internal server error" });
  //       return;
  //     } 
  //     res.json(results);
  //   });
  // });
});

app.post("/requestTopics", (req, res) => {
  const { newTopic } = req.body;
  console.log(newTopic);

  const pythonScriptPath = 'D:\\complete web dev\\python\\scrapper\\main.py';

  const args = [newTopic];

  const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });

});

app.listen(Port, () => console.log(`Server is running on port ${Port}`));


