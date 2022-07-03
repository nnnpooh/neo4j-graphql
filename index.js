const { gql, ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');
require('dotenv').config();

// const typeDefs = gql`
//   type Movie {
//     title: String!
//     year: Int
//     plot: String
//     actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
//   }

//   type Person {
//     name: String!
//     movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
//   }
// `;

const typeDefs = gql`
  type TASK {
    id: String!
    name: String!
    roles: [ROLE!]! @relationship(type: "DO_TASK", direction: IN)
    tracks: [TRACK!]! @relationship(type: "HAS_TASK", direction: IN)
    tasksPrev: [TASK!]! @relationship(type: "THEN", direction: IN)
    tasksNext: [TASK!]! @relationship(type: "THEN", direction: OUT)
  }

  type ROLE {
    id: String!
    name: String!
    tasks: [TASK!]! @relationship(type: "DO_TASK", direction: OUT)
  }

  type TRACK {
    HN: String!
    id: String!
    tasks: [TASK!]! @relationship(type: "HAS_TASK", direction: OUT)
  }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  // console.log(schema);
  const server = new ApolloServer({
    schema: schema,
  });

  server.listen().then(({ url }) => {
    console.log(`GraphQL server ready on ${url}`);
  });
});
