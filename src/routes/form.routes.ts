import express from 'express';
import * as controller from '../controllers/form.controller';

const router = express.Router();

router.route('/api/xorms/:xormId/forms')
  .get(controller.getAll)
  .post(controller.save)
;

router.route('/api/xorms/:xormId/forms/:formId')
  .get(controller.getOne)
  .put(controller.update)
  .delete(controller.remove)
;

export { router as formRouter }
