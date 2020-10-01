import {Field, InputType} from "type-graphql";
import {ObjectID} from "mongodb";
import {ID} from "../../scalars";

@InputType()
export default class DeviceDataInput {

    @Field(() => ID)
    deviceId: ObjectID;
}
