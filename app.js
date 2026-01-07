const cors = require('cors');
const express = require('express')
const app = express()
const permissionsRoutes = require('./routes/permissions')
const filesRoutes = require('./routes/files')
const usersRoutes = require('./routes/users')
const searchRoutes = require('./routes/search')
const tokensRoutes = require('./routes/tokens')

app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/api/files/:id/permissions', permissionsRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/tokens', tokensRoutes)
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});