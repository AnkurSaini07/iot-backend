import {Field, ObjectType} from "type-graphql";
import {ObjectID} from "mongodb";
import {ID, JsonObject} from "../../scalars";
import {Collection, Column} from "../../utility/MongoDecorators";

@Collection()
@ObjectType()
export default class DeviceData {

    @Field(() => ID)
    @Column({returnType: () => ObjectID})
    _id: ObjectID;

    @Field(() => ID)
    @Column({returnType: () => ObjectID})
    deviceId: ObjectID;

    @Field(() => String)
    @Column({returnType: () => String})
    devEui: string;

    @Field(() => JsonObject)
    @Column({returnType: () => Object})
    networkData: any;
}
