import { Request } from 'express';
import { GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql';
import { IRQ } from "@cellularjs/net";
import { ArticleSchema } from '$share/type';
import { localTransporter } from '$share/transporter';
import { TRACE_ID_KEY } from '$share/const';

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
  resolve: async (_, args, req: Request) => {
    const irq = new IRQ({ to: 'Article:SearchQry', [TRACE_ID_KEY]: req.headers[TRACE_ID_KEY]}, args);
    const irs = await localTransporter.send(irq);

    return irs.body.rs;
  },
}
