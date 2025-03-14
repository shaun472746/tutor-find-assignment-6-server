import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './app/middleware/notFound';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    // origin: ["http://localhost:3000"],
    origin: ['https://tutor-find-assignment-6-client.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.end('Project running');
});

app.use(notFound);
app.use(globalErrorHandler);
export default app;
