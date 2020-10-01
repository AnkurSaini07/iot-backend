import "reflect-metadata";
import expressApp from "./express-server";
import {createServer} from 'http'
import {connectToDatabaseURI} from "./utility/DbUtility";
import {ApolloServer, PubSub} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {ResolverArray} from "./modules";

require('dotenv').config();

export const pubSub = new PubSub();

const subscriptions = {
// @ts-ignore
    onConnect: (connectionParams: any) => {

    }
};

const formatError = (err: any) => {
    console.error(err);
    return err
};

// @ts-ignore
const formatResponse = (response: any, {context}: any) => {
    return response;
};

// @ts-ignore
const context = (expressContext: any) => {
    return {};
}

const main = async () => {
    const schema = await buildSchema({
        // @ts-ignore
        resolvers: ResolverArray,
        container: Container,
        pubSub
    });

    const apolloServer = new ApolloServer({
        schema,
        context,
        formatError,
        formatResponse,
        subscriptions
    });
    apolloServer.applyMiddleware({app: expressApp});
    const httpServer = createServer(expressApp);
    apolloServer.installSubscriptionHandlers(httpServer);
    connectToDatabaseURI().then(() => {
        httpServer.listen(8000, () => {
            console.log(`Server Started at ${apolloServer.graphqlPath}`);
            console.log(`Subscription Server Started at ${apolloServer.subscriptionsPath}`);
        });
    });
};

main().catch(console.error);
