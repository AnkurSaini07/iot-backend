import {Service} from "typedi";
import Device from "./Device";
import {MongoRepository} from "../../utility/MongoRepository";
import {ObjectId} from "mongodb";
import {Maybe} from "type-graphql";

@Service()
export default class DeviceRepository extends MongoRepository<Device> {
    constructor() {
        super(Device);
    }

    async getDeviceList(): Promise<Array<Device>> {
        return await this.collection().find({}).toArray();
    }

    async getDeviceById(_id: ObjectId): Promise<Maybe<Device>> {
        return await this.collection().findOne({_id}).catch(console.error);
    }

    async getDeviceByDevEui(devEui: string): Promise<Maybe<Device>> {
        return await this.collection().findOne({devEui}).catch(console.error);
    }
}
