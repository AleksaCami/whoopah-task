import Koa from 'koa';
import Router from "@koa/router";
// Routes
import categoryRouter from './routes/category';

import bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(router.routes());
app.use(categoryRouter.routes());
app.use(categoryRouter.allowedMethods())

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
