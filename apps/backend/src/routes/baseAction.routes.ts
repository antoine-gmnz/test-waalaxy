import express from 'express';

const baseActionRouter = express.Router();

baseActionRouter.get('/all', () => console.log('get all'));

export default baseActionRouter;
