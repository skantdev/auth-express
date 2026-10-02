import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { notFound } from './middlewares/not-found.middleware.js';
import { requestContext } from './middlewares/request-context.middleware.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', fileURLToPath(new URL('./views', import.meta.url)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.use(requestContext);

app.use(authRoutes);

app.get('/about', (req, res) => {
  res.send('Hello, this is the about page d.');
});

app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exitCode = 1;
  }
};

startServer();




// english- listening, reading, writing, speaking - 2 hours
// coding - 2 hours
// watching course - 3 hour
// building new concepts - 1 hour