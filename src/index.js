const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Task Manager API' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
const listEndpoints = require('express-list-endpoints');

app.use('/api/auth', authRoutes);

console.log(listEndpoints(app));