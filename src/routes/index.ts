import express, { Request, Response } from 'express';

const router = express.Router();
router.get('/', (_: Request, res: Response) => res.json('hoge'));

export default router;
