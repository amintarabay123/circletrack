import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roscasRouter from "./roscas";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(configRouter);
router.use(roscasRouter);

export default router;
