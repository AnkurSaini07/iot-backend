import {Field, ObjectType} from "type-graphql";
import {ObjectID} from "mongodb";
import {Collection, Column} from "../../utility/MongoDecorators";
import {ID} from "../../scalars";

@Collection()
@ObjectType()
export default class Device {

    @Field(() => ID)
    @Column({returnType: () => ObjectID})
    _id: ObjectID;

    @Field(() => String)
    @Column({returnType: () => String})
    devEui: string;

    @Field(() => String)
    @Column({returnType: () => String})
    name: string;

    @Field(() => String)
    @Column({returnType: () => String})
    description: string;
}
