import express from 'express';

import { getActionTypes } from '../controller/actionType.controller';

const actionTypeRouter = express.Router();

actionTypeRouter.get('', getActionTypes);

export default actionTypeRouter;
