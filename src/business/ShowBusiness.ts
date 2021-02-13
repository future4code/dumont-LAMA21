import { BandDatabase } from "../data/BandDatabase";
import { ShowDatabase } from "../data/ShowDatabase";
import { Show, ShowInputDTO, WeekDay } from "./entities/Show";
import { UserRole } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";

export class ShowBusiness {
    constructor(
        private showDatabase: ShowDatabase,
        private bandDatabase: BandDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async createShow(input: ShowInputDTO, token: string) {
        try {
            const tokenData = this.authenticator.getData(token)

            if(tokenData.role !== UserRole.ADMIN) {
                throw new CustomError(401, "Only ADMIN users can register a band")
            }

            if(!input.week_day || !input.start_time || !input.end_time || !input.band_id) {
                throw new CustomError(422, 'Fields week_day, start_time, input.end_time and band_id must be provided')
            }

            if(input.start_time < 8 || input.end_time > 23 || input.start_time >= input.end_time){
                throw new CustomError(422, "Shows must be from 8 to 23 and start_time cannot be earlier than end_time")
            }

            if(!Number.isInteger(input.start_time) || !Number.isInteger(input.end_time)){
                throw new CustomError(422, "start_time and end_time must be an integer time")
            }

            const band = await this.bandDatabase.getBandDetails(input.band_id)

            if(!band){
                throw new CustomError(401, "Band not found")
            }

            const registeredShows = await this.showDatabase.getShowsByTimes(
                input.week_day,
                input.start_time,
                input.end_time
            )

            if(registeredShows.length){
                throw new CustomError(422, "show_time unavailable, try a different time")
            }

            await this.showDatabase.createShow(
                Show.toShow({
                    ...input,
                    id: this.idGenerator.generate()
                })
            )

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    async getShowsByWeekDay(week_day: WeekDay) {
        try {
            if(!week_day) {
                throw new CustomError(422, "Please inform a week_day")
            }

            const shows = await this.showDatabase.getShowsByWeekDay(week_day)

            return {result: shows}
            
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}