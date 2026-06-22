const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (index.html, styles.css, script.js, images/)
app.use(express.static(path.join(__dirname)));

// Fallback — always serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ArcheoFun running at http://localhost:${PORT}`);
});
