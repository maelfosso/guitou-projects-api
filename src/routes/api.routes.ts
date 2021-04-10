import express, { Request, Response } from 'express';

const router = express.Router();

router.route('/healthz')
  .get((req: Request, res: Response) => {
    return res.status(201).json({
      message: "it's working"
    });
  })
;

export { router as apiRouter }
