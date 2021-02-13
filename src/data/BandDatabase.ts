import { Band } from "../business/entities/Band";
import { CustomError } from "../business/error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class BandDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_BANDS"

    public async registerBand(band: Band): Promise<void> {
        try {
            await BaseDatabase.connection
                .insert({
                    id: band.getId(),
                    name: band.getName(),   
                    music_genre: band.getMusic_genre(),
                    responsible: band.getResponsible()
                })
                .into(BandDatabase.TABLE_NAME)
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async getBandDetails(input: string): Promise<Band> {
        try {
            const band = await BaseDatabase.connection
            .select("*")
            .from(BandDatabase.TABLE_NAME)
            .where({id: input})
            .orWhere({name: input})

            if(!band[0]) {
                throw new CustomError(401, "Band not found")
            }

            return Band.toBand(band[0])!
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }
}