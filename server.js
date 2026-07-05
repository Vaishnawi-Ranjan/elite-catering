const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db");
const transporter=require("./email");
const app = express();

// ======================
// Middleware
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// ======================
// Home Page
// ======================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Booking Form
// ======================

app.post("/book", (req, res) => {

    const {
        name,
        address,
        bookingDate,
        persons,
        phone,
        event,
        message
    } = req.body;

    const sql = `
        INSERT INTO bookings
        (full_name,address,booking_date,people,phone,event_type,message,status)
        VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [name, address, bookingDate, persons, phone, event, message, "Pending"],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            // ======================
            // Send Email
            // ======================

            const mailOptions = {

                from: "vaishnawiranjan7070@gmail.com",

                to: "vaishnawiranjan7070@gmail.com",

                subject: "🎉 New Catering Booking Received",

                html: `

                <h2>New Booking Received</h2>

                <table border="1" cellpadding="10" cellspacing="0">

                    <tr>
                        <th>Name</th>
                        <td>${name}</td>
                    </tr>

                    <tr>
                        <th>Phone</th>
                        <td>${phone}</td>
                    </tr>

                    <tr>
                        <th>Address</th>
                        <td>${address}</td>
                    </tr>

                    <tr>
                        <th>Booking Date</th>
                        <td>${bookingDate}</td>
                    </tr>

                    <tr>
                        <th>People</th>
                        <td>${persons}</td>
                    </tr>

                    <tr>
                        <th>Event</th>
                        <td>${event}</td>
                    </tr>

                    <tr>
                        <th>Message</th>
                        <td>${message}</td>
                    </tr>

                </table>

                <br>

                <h3>Elite Catering Website</h3>

                `

            };

            transporter.sendMail(mailOptions, (error, info) => {

                if (error) {

                    console.log(error);

                } else {

                    console.log("✅ Email Sent Successfully");

                }

                res.send(`
                    <h1>Booking Submitted Successfully ✅</h1>
                    <h3>Thank You For Choosing Elite Catering.</h3>
                    <a href="/">Go Back</a>
                `);

            });

        }
    );

});
// ======================
// Admin Login
// ======================
app.post("/admin-login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {

        res.json({
            success: true
        });

    } else {

        res.json({
            success: false,
            message: "Invalid Username or Password"
        });

    }

});

// ======================
// Get All Bookings
// ======================
app.get("/bookings", (req, res) => {

    const sql = "SELECT * FROM bookings ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        res.json(result);

    });

});

// ======================
// Server
// ======================
const PORT = 3000;
// Delete Booking

app.delete("/booking/:id",(req,res)=>{

const id=req.params.id;

db.query(

"DELETE FROM bookings WHERE id=?",

[id],

(err,result)=>{

if(err){

return res.json({

success:false

});

}

res.json({

success:true

});

}

);

});
app.put("/booking/:id",(req,res)=>{

const id=req.params.id;

const status=req.body.status;

db.query(

"UPDATE bookings SET status=? WHERE id=?",

[status,id],

(err,result)=>{

if(err){

return res.json({

success:false

});

}

res.json({

success:true

});

}

);

});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});