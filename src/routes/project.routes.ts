import express from 'express';
import * as controller from '../controllers/project.controller';

const router = express.Router();

router.route('/projects/:projectId/xorms')
  .get(controller.getAll)
  .post(controller.save);

router.route('/projects/:projectId/xorms/:xormId')
  .get(controller.getOne)

export { router as projectRouter }
