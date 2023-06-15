import Koa from 'koa';

const app = new Koa();

// Basic response
app.use(ctx => {
  ctx.body = 'Hello, Koa with TypeScript!';
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
