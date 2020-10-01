import {getDb} from "./DbUtility";
import {ClassType, getCollectionName, getDocument} from "./MongoDecorators";
import {Maybe} from "type-graphql";
import {ObjectId} from "bson";
import {Collection} from "mongodb";

export class MongoRepository<DOCUMENT extends { _id: Maybe<ObjectId> | undefined }> {

    private readonly classType: ClassType;

    constructor(classType: ClassType<DOCUMENT>) {
        this.classType = classType;
    }

    /**
     * Use this function to save or update record in database with dependency injection.
     * @param record
     */
    async save(record: DOCUMENT): Promise<void> {
        const db = getDb();
        const document: DOCUMENT = getDocument(this.classType, record);
        if (record._id) {
            await db.collection(getCollectionName(this.classType)).updateOne({_id: record._id}, document).catch(console.error);
        } else {
            await db.collection(getCollectionName(this.classType)).insertOne(document).catch(console.error);
            record._id = document._id;
        }
    }

    /**
     * Use this function to save or update records in database with dependency injection.
     * @param records
     */
    async saveMany(records: Array<DOCUMENT>): Promise<void> {
        await Promise.all(records.map(record => {
            return this.save(record);
        }));
    }

    collection(): Collection {
        const db = getDb();
        return db.collection(getCollectionName(this.classType));
    }
}
