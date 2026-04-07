import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roscasRouter from "./roscas";

const router: IRouter = Router();

router.use(healthRouter);
router.use(roscasRouter);

export default router;
