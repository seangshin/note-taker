const express = require("express");//bring in express
const path = require("path");//bring in path, which helps to direct the system to where the file lives
const db = require("./db/db.json");
const fs = require("fs");
const uuid = require('./helpers/uuid');

const app = express();//setup express app
const PORT = 3001;

//app.use sets up the following built-in middleware functions in express
app.use(express.static("public"));//used to serve static assets in a specific root directory, in this case "public"
app.use(express.json());//used to parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));//used to parse incoming requests with url encoded payloads

//***Register routes for HTTP GET requests to serve static assets***
///notes route to direct users to notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
  //read the db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //convert string into JSON object
      const parsedData = JSON.parse(data);
      //return all saved notes as JSON
      res.json(parsedData);
    }
  })
});
// Wildcard route to direct users to index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

//HTTP POST request to update notes in db
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved to add a note`);
  
  //Recieve a new note to save on the request body
  //Destructuring assignment for the items in req.body
  const {title, text} = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    //Append note to db.json file
    //Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //convert string into JSON object
        const parsedNotes = JSON.parse(data);

        //add new note
        parsedNotes.push(newNote);

        //Write updated notes back to file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.'));
      }
    });

    
    console.info(`Added the following object: ${JSON.stringify(newNote)}`);//debug
    res.status(201).json('Note added successfully');
  } else {
    res.status(500).json('Error in posting note');
  }
});

//HTTP DELETE request to remove notes in db
app.delete('/api/notes/*', (req, res) => {
  console.info(`${req.method} request recieved to remove a note`);

  const selectedId = req.params[0];

  if (selectedId) {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //convert string into JSON object
        const parsedNotes = JSON.parse(data);

        //console.info(`current db: ${JSON.stringify(parsedNotes)}`);//debug

        //delete note with specified id
        const filteredNotes = parsedNotes.filter(function(note) {
          return note.id != selectedId;
        });
        //console.info(`new db: ${JSON.stringify(filteredNotes)}`);//debug

        //Write updated notes back to file
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.'));
      } 
    });

    //console.info(`Updated object: ${JSON.stringify(filteredNotes)}`);//debug
    res.status(201).json('Note added successfully');
  } else {
    res.status(500).json('Error in deleting note');
  }
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));