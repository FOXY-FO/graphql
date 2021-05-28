const graphql = require("graphql")
const axios = require("axios")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
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
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return instance.post("/users", args).then((r) => r.data)
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return instance.delete(`/users/${id}`).then((r) => r.data)
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLString },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return instance.patch(`/users/${args.id}`, args).then((r) => r.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation,
})
