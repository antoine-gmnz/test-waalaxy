import express from 'express';
import { getQueue } from '../controller/queue.controller';

const queueRouter = express.Router();

queueRouter.get('/', getQueue);

export default queueRouter;
