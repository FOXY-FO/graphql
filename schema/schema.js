const graphql = require("graphql")
const axios = require("axios")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql

const instance = axios.create({
  baseURL: "http://localhost:3000",
})

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return instance
          .get(`/companies/${parentValue.id}/users`)
          .then((r) => r.data)
      },
    },
  }),
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
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
  }),
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

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {},
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
})
