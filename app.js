import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import pg from "pg";
import session from "express-session";
// import Readable from "stream";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    password: "Vinay@2004",
    database: "bookexch",
    port: 5432
});

db.connect();

app.use(session({
    secret: "iamVinay@2004",
    resave: false,
    saveUninitialized: true
  }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.render("user.ejs");
});

app.get("/login", (req, res) => {
    res.render("index.ejs");
});

app.get("/home", async (req, res) => {
    let ssn = req.session.email
    if(ssn) {
        const get = await db.query("SELECT * FROM users WHERE email = ($1)", [ssn]);
        console.log(get);

        const imD = get.rows[0].img;
        console.log(imD)
        const imgBase64 = imD.toString('base64');
        const imgUrl = `data:image/jpeg;base64,${imgBase64}`;

        res.render("userhome.ejs", {imgUrl});
    }  
    else{
        res.redirect("/login");
    }
})

app.get("/edit", async (req, res) => {
    console.log("console is working");
    let ssn = req.session.email;

    if (ssn) {
        const get = await db.query("SELECT * FROM users WHERE email = ($1)", [ssn]);
        console.log(get);

        const imD = get.rows[0].img;
        console.log(imD)
        const imgBase64 = imD.toString('base64');
        const imgUrl = `data:image/jpeg;base64,${imgBase64}`;

        try {
            const result = await db.query("SELECT * FROM books INNER JOIN users ON books.email = users.email");

            if (result.rows && result.rows.length > 0) {
                console.log("Data found in the result.");

                // Declare an array to store the rows
                let booksData = [];

                for (let i = 0; i < result.rows.length; i++) {
                    let image = result.rows[i].image;
                    if (image) {
                        const imageBase64 = image.toString('base64');
                        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
                        booksData.push({
                            img: imageUrl,
                            bk_name: result.rows[i].name_of_book,
                            author: result.rows[i].author,
                            moreInfo: result.rows[i].more_info,
                            username: result.rows[i].name,
                            email: result.rows[i].email,
                            phone: result.rows[i].phone_num
                        });
                    }
                    else {
                        console.log(`Image data missing for record at index ${i}`);
                    }
                }

                // Log the array outside the loop
                // console.log(booksData);

                res.render("gently.ejs",{booksData, imgUrl});
            } 
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        console.log("Session email not found.");
        res.render("index.ejs");
    }
});



app.post("/signup", upload.single("img"), async (req, res) => {

    const { name, email, pass, ph_num, address, question, answer } = req.body;
    const imgBuffer = req.file.buffer;
    // console.log(req.file.buffer);

    try {
        await db.query("INSERT INTO users (name, email, password, phone_num, address, question, answer, img) VALUES (($1),($2),($3),($4),($5),($6),($7),($8))", [name, email, pass, ph_num, address, question, answer, imgBuffer]);
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    try {
        let ssn = req.session;
        const { email, password, answer } = req.body;
        let em =email

        let users = [];
        let message = "Hi!";
        const result = await db.query("SELECT email, password, question, answer FROM users");
        users = result.rows;
        // console.log(users);
        // console.log(result);
        let isAuthenticated = false;

        for (let i = 0; i < users.length; i++) {
            if (em == users[i].email && password == users[i].password) {
                isAuthenticated = true;
                ssn.email = email;
                break; // Exit the loop if authenticated
            }
        }
        // for (let i = 0; i < users.length; i++) {
        //     let question = users[i].question;
        //     if(answer === users[i].answer) {
        //         // res.render("/edit")
        //     }
        
        if (isAuthenticated) {
            res.redirect("/home");
        } else {
            let question
            for (let i = 0; i < users.length; i++) {
                if (em == users[i].email ) {
                    question=users[i].question;
                    break;
                }
        }
            res.render("index.ejs", { 
                message: "You Entered a Wrong Password or Invalid Email Id!!!" ,
                question
            });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/edited", upload.single("image"), async (req, res) => {

    

    const { bookname, authorname, moreinfo } = req.body;
    const imageBuffer = req.file.buffer;
    let ssn = req.session.email;

    try {
        await db.query("INSERT INTO books (name_of_book, author, image, more_info, email) VALUES (($1),($2),($3),($4),($5))", [bookname, authorname, imageBuffer, moreinfo, ssn]);
        res.redirect("/edited");
    } catch (err) {
        console.log(err);
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

// app.get(`/edited`, (req, res) => {
//     // const id = req.params.id;
//     // res.render("profile.ejs");
//     db.query("SELECT * FROM books", (err, result) => {
//         // console.log(result);
//         if (err) {
//             console.log(err);
//             return res.status(500).send('Internal Server Error');
//         }
//         let arr = []
//       for(let i = 0 ; i <= result.rows.length ; i++) {
//         // Check if there's at least one row in the result
//             const imageData = result.rows[i].image; // Assuming there's only one result
//             const imageBase64 = imageData.toString('base64');
//             const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
//             // console.log(imageUrl);
//             arr.push(imageUrl);
//             // console.log(arr);
//       };
//       res.render("profile.ejs", { arr });
//     });
// });

app.get("/edited", async (req, res) => {
    let ssn = req.session.email;
    if(ssn) {
        const get = await db.query("SELECT * FROM users WHERE email = ($1)", [ssn]);
        console.log(get);

        const imD = get.rows[0].img;
        console.log(imD)
        const imgBase64 = imD.toString('base64');
        const imgUrl = `data:image/jpeg;base64,${imgBase64}`;
        // let array = [];
        // if (get.rows.length > 0) {
        //     for (let i = 0; i < get.rows.length; i++) {
        //         if(get.rows[i].email == ssn) {
        //         const imD = get.rows[i].image;
        //         if (imD) {
        //             const imgBase64 = imD.toString('base64');
        //             const imgUrl = `data:image/jpeg;base64,${imgBase64}`;
        //             // array.push(imgUrl);
        //         } else {
        //             console.log(`Image data missing for record at index ${i}`);
        //         }
        //         }
        //     }
        // } else {
        //     console.log('No records found in the database');
        // }
        // res.redirect("/edited", {get});

        db.query("SELECT * FROM books", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        let mes;
        if (!result || result.rows.length === 0) {
            res.render("profile.ejs")
            return mes = "You have no books to be shown!!!!"     
        }

        let arr = [];
        if (result.rows.length > 0) {
            for (let i = 0; i < result.rows.length; i++) {
                if(result.rows[i].email == ssn) {
                const imageData = result.rows[i].image;
                if (imageData) {
                    const imageBase64 = imageData.toString('base64');
                    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
                    arr.push(imageUrl);
                } else {
                    console.log(`Image data missing for record at index ${i}`);
                }
                }
            }
        } else {
            console.log('No records found in the database');
        }

        res.render("profile.ejs", { arr, get, imgUrl });
    });
} else {
    res.redirect("/login");
}
});

// app.post("/forgot", async (req, res) => {
//     const { question, answer } = req.body;

//     try {
//         // Hash the password before storing it in the database
//         await db.query("INSERT INTO users (question, answer) VALUES (($1),($2)", [question, answer]);
//         res.redirect("/login");
//     } catch (err) {
//         console.log(err);
//     }
// })

app.get("/delete", async (req, res) => {
    let ssn = req.session.email;
    if(ssn) {
        await db.query("DELETE FROM books WHERE email = ($1);", [ssn]);
        res.redirect("/edited")
    } else {
        res.redirect("/login");
    }

}) 

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
