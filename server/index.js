const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Vtryon Backend is running!');
});

const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
