import { graphqlHTTP } from 'express-graphql'
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { articleQuery } from './article.query'

const rootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  description: 'description',
  fields: {
    article: articleQuery,
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
});

export const graphRouter = graphqlHTTP({
  schema,
  graphiql: true,
});
