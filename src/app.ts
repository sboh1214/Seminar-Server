import e from "express";

const app = e();
const port = 3000;

app.get("/", (_: e.Request, res: e.Response) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
