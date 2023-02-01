import * as mongoosePaginate from 'mongoose-paginate-v2';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { getModelForClass, prop, plugin } from '@typegoose/typegoose';

// export interface IStation {
//     _id: Number,
//     nimi: String,
//     namn: String,
//     name: String,
//     osoite: String,
//     adress: String,
//     kaupunki: String,
//     stad: String,
//     operaattor: String,
//     kapasiteet: Number,
//     xPos: Number,
//     yPos: Number
// }

type PaginateMethod<T> = (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;

@plugin(mongoosePaginate)
class Station {
    @prop()
    _id: number;
    @prop()
    nimi: string;
    @prop()
    namn?: string;
    @prop()
    name?: string;

    @prop()
    osoite?: string;
    @prop()
    adress?: string;
    @prop()
    kaupunki?: string;
 
    @prop()
    stad?: string;
    @prop()
    operaattor?: string;

    @prop()
    kapasiteet: number;

    @prop()
    xPos: number;
    @prop()
    yPos: number;


    static paginate: PaginateMethod<Station>;
}


export default getModelForClass(Station);
