const express = require("express");//bring in express
const path = require("path");//bring in path, which helps to direct the system to where the file lives

const app = express();//setup express app
const PORT = 3001;

//app.use sets up the following built-in middleware functions in express
app.use(express.static("public"));//used to serve static assets in a specific root directory, in this case "public"
app.use(express.json());//used to parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));//used to parse incoming requests with url encoded payloads

//serve the static asset => index.html 
//app.get('/', (req, res) =>
  //res.sendFile(path.join(__dirname, '/public/index.html'))
//);

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));