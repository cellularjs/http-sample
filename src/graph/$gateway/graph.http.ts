import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid';
import { graphqlHTTP } from 'express-graphql'
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { TRACE_ID_KEY } from '$share/const';
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

function graphQlWithId(graphqlMiddleware) {
  return (req: Request, res, next) => {
    req.headers[TRACE_ID_KEY] = uuidv4();

    graphqlMiddleware(req, res).then(() => next(), next);
  };
}

export const graphRouter = graphQlWithId(graphqlHTTP({
  schema,
  graphiql: true,
}));
