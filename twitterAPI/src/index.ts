import app from './app';
const port: number = app.get('port');
app.listen(app.get('port'), () => {
  console.log(`server running at http://localhost:${port}/`);
});
