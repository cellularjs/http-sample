import { IRQ, send } from "@cellularjs/net";
import { GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql';
import { ArticleSchema } from '$share/type';

const articleType = new GraphQLObjectType<ArticleSchema>({
  name: 'Article',
  fields: {
    id: {
      type: GraphQLString,
      resolve: article => article.id,
    },
    title: {
      type: GraphQLString,
      resolve: article => article.title,
    },
    content: {
      type: GraphQLString,
      resolve: article => article.content,
    },
  },
});

export const articleQuery = {
  type: new GraphQLList(articleType),
  args: {
    id: {
      name: 'id',
      type: GraphQLString,
    },
    q: {
      name: 'q',
      type: GraphQLString,
    },
  },
  resolve: async (_, args) => {
    const irq = new IRQ({ to: 'Article:SearchQry'}, args);
    const irs = await send(irq);

    return irs.body.rs;
  },
}
