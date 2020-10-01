import {Arg, Mutation, Query, Resolver} from "type-graphql";
import Device from "./Device";
import DeviceRepository from "./Device.repository";
import DeviceInput from "./Device.input";
import {mergeObject} from "../../utility/Helper";

@Resolver(() => Device)
export default class DeviceResolver {

    constructor(private deviceRepo: DeviceRepository) {
    }

    @Mutation(() => Device)
    async saveDevice(@Arg("device")deviceInput: DeviceInput): Promise<Device> {
        let deviceDB = await this.deviceRepo.getDeviceById(deviceInput._id);
        if (!deviceDB) {
            deviceDB = new Device();
        }
        deviceDB = mergeObject<Device>(deviceDB, deviceInput);
        await this.deviceRepo.save(deviceDB);
        return deviceDB;
    }

    @Query(() => [Device])
    async getDeviceList(): Promise<Array<Device>> {
        return this.deviceRepo.getDeviceList();
    }
}
