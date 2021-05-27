const graphql = require("graphql")
const axios = require("axios")
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql

const instance = axios.create({
  baseURL: "http://localhost:3000",
})

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return instance
          .get(`/companies/${parentValue.companyId}`)
          .then((res) => res.data)
      },
    },
  },
})

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return instance.get(`/users/${args.id}`).then((resp) => resp.data)
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return instance.get(`/companies/${args.id}`).then((r) => r.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
})
