const express = require("express");//bring in express
const path = require("path");//bring in path, which helps to direct the system to where the file lives
const db = require("./db/db.json");

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
  res.json(db);
  //read the db.json file
  //return all saved notes as JSON
});
// Wildcard route to direct users to index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved to add a review`);
  
  //Destructuring assignment for the items in req.body
  const {title, text} = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      //review_id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    console.info(response);//debug
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
  //recieve a new note to save on the request body
  //add it to the db.json file
  //return the new note to the client (note: need to assign a unique id when saved)
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));