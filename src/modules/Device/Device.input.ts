import {Field, InputType} from "type-graphql";
import {ObjectID} from "mongodb";
import {ID} from "../../scalars";

@InputType()
export default class DeviceInput {

    @Field(() => ID, {nullable: true})
    _id: ObjectID;

    @Field(() => String)
    devEui: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;
}
