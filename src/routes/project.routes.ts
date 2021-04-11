import express from 'express';
import { body, validationResult } from 'express-validator';
import * as controller from '../controllers/project.controller';

const router = express.Router();

router.route('/projects/:projectId/xorms')
  .get(controller.getAll)
  .post(
    [
      body('title')
        .notEmpty()
        .withMessage('Title must be given'),
      body('description')
        .notEmpty()
        .withMessage('Description must be give')
    ],
    validationResult,
    controller.save
  );

router.route('/projects/:projectId/xorms/:xormId')
  .get(controller.getOne)

export { router as projectRouter }
