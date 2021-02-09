import express from 'express';
import * as controller from '../controllers/xorm.controller';

const router = express.Router();

router.route('/api/xorms/:xormId/forms')
  .get(controller.getAll)
  .post(controller.save);

router.route('/api/xorms/:xormId/forms/:formId')
  .get(controller.getOne)

export { router as xormRouter }
