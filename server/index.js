import express from 'express';
const app = express()
const port = 3003

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})