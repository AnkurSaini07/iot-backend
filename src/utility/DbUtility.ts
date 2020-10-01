import {Db, MongoClient} from "mongodb";

let db: Db;

export const connectToDatabaseURI = async (): Promise<Db> => {
    const client = await MongoClient.connect(process.env.DB_URI || '', {useUnifiedTopology: true});
    db = client.db(process.env.DB_NAME);
    return db;
}

export const getDb = (): Db => db;
