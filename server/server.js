const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const firebaseAdmin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
