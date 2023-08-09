var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var mysql = require("mysql2"); // Import mysql2 library

var app = express();
app.use(cors());
app.use(bodyParser.json())


//MySQL configuration
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Leaf4dead2",
    database: "SmartDB",
});

//Connect to MySQL
connection.connect(function (err) {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + connection.threadId);
});
//restfull API req: client gui len, res: server tra ve client
//show all book
app.get("/Sensor_show", function (req, res) {
    connection.query(
        "Select * from SensorData ",
        function (err, result) {
            if (err) {
                console.error("Error Select Sensor data: " + err.message);
                res.status(500).send("Error fetching Sensor data");
            } else {
                console.log("Sensor data selected successfully.");
                res.send(result);
            }
        }
    );

})
//show book theo id
app.get("/book_show/:id", function (req, res) {
    const { id } = req.params;
    connection.query(
        "Select * from book where id = ?", [id],
        function (err, result) {
            if (err) {
                console.error("Error Select book data: " + err.message);
                res.status(500).send("Error fetching book data");
            } else {
                console.log("book data selected successfully.");
                res.send(result);
            }
        }
    );
})
//show author theo bookid
app.get("/author_show/:book_id", function (req, res) {
    const {book_id} = req.params;
    connection.query(
        "Select * from author where book_id = ?", [book_id],
        function (err, result) {
            if (err) {
                console.error("Error Select author data: " + err.message);
                res.status(500).send("Error fetching author data");
            } else {
                console.log("author data selected successfully.");
                res.send(result);
            }
        }
    );
})

app.post("/book_add", function (req, res) {
    const { id, name } = req.body
    //  Insert the newbook data into MySQL
    connection.query(
        "INSERT INTO book (id, name) VALUES (?, ?)",
        [id, name],
        function (err, result) {
            if (err) {
                console.error("Error inserting book data: " + err.message);
            } else {
                res.send("inserted successfully")
                console.log("book data inserted successfully.");
            }
        }
    );
})
app.post("/book_update/:id", function (req, res) {
    const { name } = req.body;
    const { id } = req.params;
    //  Insert the newbook data into MySQL
    connection.query(
        "UPDATE book SET name = ? WHERE id = ?",
        [name, id],
        function (err, result) {
            if (err) {
                console.error("Error Updating book data: " + err.message);
            } else {
                if (result.affectedRows === 0) {
                    // If no book with the specified id is found
                    res.status(404).send("book not found");
                } else {
                    console.log("book data updated successfully.");
                    res.send("book data updated successfully.");
                }
            }
        }
    );
})

// server
var server = app.listen(2009, function () {
    console.log("Server dang chay o http://%s:%s", server.address().address, server.address().port);
})
