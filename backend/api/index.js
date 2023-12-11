const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const port = 3001;

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const query = 'SELECT * FROM Projects';

app.get('/', (req, res) => {
  connection.promise().query(query)
    .then(([rows, fields]) => {
      res.end(JSON.stringify(rows));
    });
});

app.post('/filter', (req, res) => {
  const { appliedFilters, searchText } = req.body;

  // Build your SQL query based on appliedFilters
  let sql = 'SELECT * FROM Projects WHERE 1';

  // Iterate over each key-value pair in appliedFilters
  Object.entries(appliedFilters).forEach(([filterType, filterValues]) => {
    if (filterValues.length > 0) {
      // Modify the query based on filterValues
      // Note: This is a simple example, and you should validate and sanitize inputs
      sql += ` AND ${filterType} IN ('${filterValues.join("','")}')`;
    }
  });

  if (searchText !== "") {
    // Add conditions for each column you want to search
    sql += ` AND (FundingYear LIKE '%${searchText}%' OR ProjectType LIKE '%${searchText}%' OR Investigator LIKE '%${searchText}%' OR Title LIKE '%${searchText}%')`;
  }

  // Execute the query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.get('/project', (req, res) => {
  const projectId = parseInt(req.query.id);
  console.log(projectId);
  let sql = `SELECT * FROM Projects WHERE ID = ${projectId}`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log(result);
    res.json(result);
  });

});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});