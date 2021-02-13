import { Show, ShowOutputDTO, WeekDay } from "../business/entities/Show"
import { CustomError } from "../business/error/CustomError"
import { BaseDatabase } from "./BaseDatabase"

export class ShowDatabase extends BaseDatabase {

    public async createShow(show: Show): Promise<void> {
        try {
            await BaseDatabase.connection
                .insert({
                    id: show.getId(),
                    week_day: show.getWeek_day(),
                    start_time: show.getStart_time(),
                    end_time: show.getEnd_time(),
                    band_id: show.getBand_id()
                })
                .into(this.tableNames.shows)
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async getShowsByTimes(
        week_day: WeekDay,
        start_time: number,
        end_time: number
    ): Promise<ShowOutputDTO[]> {
        const shows = await BaseDatabase.connection
            .select("*")
            .where("end_time", ">", `${start_time}`)
            .andWhere("start_time", "<", `${end_time}`)
            .from(this.tableNames.shows)

        return shows.map((show: any) => {
            return {
                id: show.id,
                week_day: show.week_day,
                start_time: show.start_time,
                end_time: show.end_time,
                band_id: show.band_id
            }
        })
    }

    public async getShowsByWeekDay(week_day: WeekDay): Promise<ShowOutputDTO[]> {
        const shows = await BaseDatabase.connection.raw(`
            SELECT  s.id as id,
                    b.id as band_id,
                    s.start_time as start_time,
                    s.end_time as end_time,
                    s.week_day as week_day,
                    b.music_genre as music_genre
            FROM ${this.tableNames.shows} s
            LEFT JOIN ${this.tableNames.bands} b ON b.id = s.band_id
            WHERE s.week_day = "${week_day}"
            ORDER BY start_time ASC
        `)

        if (!shows.length) {
            throw new CustomError(401, `Could not find shows on ${week_day}`)
        }

        return shows[0].map((data: any) => ({
            id: data.id,
            band_id: data.band_id,
            start_time: data.start_time,
            end_time: data.end_time,
            week_day: data.week_day,
            music_genre: data.music_genre
        }))
    }
}

