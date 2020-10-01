import {Arg, Query, Resolver} from "type-graphql";
import DeviceData from "./DeviceData";
import DeviceDataRepository from "./DeviceData.repository";
import DeviceDataInput from "./DeviceData.input";

@Resolver(() => DeviceData)
export default class DeviceDataResolver {

    constructor(private deviceDataRepo: DeviceDataRepository) {
    }

    @Query(() => [DeviceData])
    async getDeviceData(@Arg("deviceDataInput")deviceDataInput: DeviceDataInput): Promise<Array<DeviceData>> {
        return this.deviceDataRepo.getDeviceData(deviceDataInput.deviceId);
    }
}
