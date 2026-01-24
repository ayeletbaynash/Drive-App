const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose');
const app = express()

const permissionsRoutes = require('./routes/permissions')
const filesRoutes = require('./routes/files')
const usersRoutes = require('./routes/users')
const searchRoutes = require('./routes/search')
const tokensRoutes = require('./routes/tokens')

const connectionString = process.env.CONNECTION_STRING;

// connect to MongoDB
mongoose.connect(connectionString)
.then(() => console.log('Connected to MongoDB via Mongoose!'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/files/:id/permissions', permissionsRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tokens', tokensRoutes)

const port = process.env.PORT;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});