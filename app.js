const express=require('express')
const dotenv=require('dotenv')
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

dotenv.config()
// Connect to database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

// Routes
app.use('/user', require('./routes/userRoutes'));
app.use('/tache', require('./routes/tacheRoutes'));


// Start the server
const port=process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
