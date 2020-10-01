import {GraphQLScalarType, Kind} from "graphql";
import {ObjectId} from "mongodb";
import {UserInputError} from "apollo-server-express";

export const JsonObject = new GraphQLScalarType({
    name: 'JsonObject',
    description: 'JsonObject',
    parseValue: (value: string) => {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },
    serialize: (value: any) => {
        return value;
    },
    parseLiteral: (ast: any) => {
        try {
            return JSON.parse(ast.value);
        } catch (e) {
            return ast.value;
        }
    }
});

export const ID = new GraphQLScalarType({
    name: "ID",
    description: "Mongo object id scalar type",
    parseValue(value: string) {
        return new ObjectId(value); // value from the client input variables
    },
    serialize(value: ObjectId) {
        return value.toHexString(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new ObjectId(ast.value); // value from the client query
        }
        return null;
    },
});

export const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value),
    parseLiteral: (ast) => {
        if (ast.kind === Kind.STRING) {
            if (isNaN(Date.parse(ast.value))) {
                throw new UserInputError(`'${ast.value}' is invalid Date.`);
            }
            return new Date(ast.value);
        }
        return null;
    }
});
