const express = require('express');
const bodyParser = require('body-parser');
const mortgageRoutes = require('./routes/mortgageRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());
app.use(cors());
app.use('/api', mortgageRoutes);

module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
