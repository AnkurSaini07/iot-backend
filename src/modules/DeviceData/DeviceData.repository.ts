import {Service} from "typedi";
import {MongoRepository} from "../../utility/MongoRepository";
import {ObjectId} from "mongodb";
import DeviceData from "./DeviceData";

@Service()
export default class DeviceDataRepository extends MongoRepository<DeviceData> {
    constructor() {
        super(DeviceData);
    }

    async getDeviceData(deviceId: ObjectId): Promise<Array<DeviceData>> {
        return await this.collection().find({deviceId}).toArray();
    }
}
