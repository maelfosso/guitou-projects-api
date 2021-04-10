import express from 'express';
import * as controller from '../controllers/xorm.controller';

const router = express.Router();

router.route('/projects/:projectId/xorms')
  .get(controller.getAll)
  .post(controller.save)
;

router.route('/projects/:projectId/xorms/:xormId')
  .get(controller.getOne)
  .put(controller.update)
  .delete(controller.remove)
;

export { router as xormRouter }
