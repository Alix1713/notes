const express = require("express");
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3001;
const path = require("path"); //this is what was throwing it off look into this
const app = express();
const fs = require("fs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index")));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes"))
);

//* `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  //it was notes
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    //db or notes?
    if (err) {
      console.log(err);
    }
    console.log(data);
    res.json(JSON.parse(data));
  });
  console.log(`${req.method} request received to get notes`);
});

//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
//You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post("/api/notes", (req, res) => {
  // db or notes?
  console.log(`${req.method} request received to add a note`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      //db or notes?
      if (err) {
        console.log(err);
      } else {
        const parseNotes = JSON.parse(data);

        parseNotes.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parseNotes, null),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated note!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});

//this needs to be last
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
