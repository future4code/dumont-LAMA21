import { BandDatabase } from "../data/BandDatabase";
import { Band, BandInputDTO } from "./entities/Band";
import { UserRole } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";

export class BandBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private bandDatabase: BandDatabase
    ) { }

    async registerBand(band: BandInputDTO, token: string) {
        try {
            const tokenData = this.authenticator.getData(token)

            if (tokenData.role !== UserRole.ADMIN) {
                throw new CustomError(401, "Only ADMIN users can register a band")
            }

            if (!band.name || !band.music_genre || !band.responsible) {
                throw new CustomError(422, 'Fields name, musicGenre and resposible must be provided')
            }

            await this.bandDatabase.registerBand(
                Band.toBand({
                    ...band,
                    id: this.idGenerator.generate()
                })!
            )
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    async getBandDetails(input: string): Promise<Band> {
        try {
            if (!input) {
                throw new CustomError(422, "Please provide a Band id or name")
            }
            return this.bandDatabase.getBandDetails(input)
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}