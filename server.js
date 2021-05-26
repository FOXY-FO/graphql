const express = require("express")
const { graphqlHTTP } = require("express-graphql")

const app = express()
const PORT = 4000

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
  })
)

app.listen(PORT, () => {
  console.log(`Server started at the https://localhost:${PORT}`)
})
