import * as mongoosePaginate from 'mongoose-paginate-v2';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { getModelForClass, prop, plugin } from '@typegoose/typegoose';
// export interface IJourney {
//     departureDate: Date,
//     returnDate: Date,
//     departureStationId: Number,
//     returnStationId: Number,
//     distance: Number,
//     duration: Number
// }


// const journeySchema = new Schema<IJourney>({
//     departureDate: { type: Date, required: true },
//     returnDate: { type: Date, required: true },
//     departureStationId: { type: Number, required: true },
//     returnStationId: { type: Number, required: true },
//     distance: { type: Number, required: true },
//     duration: { type: Number, required: true }
// });

// export const Journey: model = model<IJourney>('Journey', journeySchema);


type PaginateMethod<T> = (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;

@plugin(mongoosePaginate)
class Journey {
    @prop()
    departureDate: Date;
    @prop()
    returnDate: Date;
    @prop()
    departureStationId: number;
    @prop()
    departureStationName: string;
    @prop()
    returnStationId: number;
    @prop()
    returnStationName: string;
    @prop()
    distance: number;
    @prop()
    duration: number;

    static paginate: PaginateMethod<Journey>;
}


export default getModelForClass(Journey);
