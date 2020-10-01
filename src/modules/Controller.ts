import {Service} from "typedi";
import {Post} from "../express-server";
import DeviceRepository from "./Device/Device.repository";
import DeviceDataRepository from "./DeviceData/DeviceData.repository";
import DeviceData from "./DeviceData/DeviceData";
import {mergeObject} from "../utility/Helper";

@Service()
export default class Controller {

    constructor(private deviceRepo: DeviceRepository, private deviceDataRepo: DeviceDataRepository) {

    }

    @Post("/api/notify")
    async notify(req: any, res: any) {
        const data: any = req.body;
        const deviceDB = await this.deviceRepo.getDeviceByDevEui(data.devEui);
        if (!deviceDB) {
            res.status(404);
            res.end();
            return;
        }
        const deviceData: DeviceData = mergeObject(new DeviceData(), {
            devEui: deviceDB.devEui,
            deviceId: deviceDB._id,
            networkData: data
        });
        await this.deviceDataRepo.save(deviceData);
        res.status(200);
        res.end();
        return;
    }
}
