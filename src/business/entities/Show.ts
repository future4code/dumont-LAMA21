import { CustomError } from "../error/CustomError"

export class Show {
    constructor(
        private id: string,
        private week_day: WeekDay,
        private start_time: number,
        private end_time: number,
        private band_id: string
    ) {}

    public getId(): string {
        return this.id
    }

    public getWeek_day(): WeekDay {
        return this.week_day
    }

    public getStart_time(): number {
        return this.start_time
    }

    public getEnd_time(): number {
        return this.end_time
    }

    public getBand_id(): string {
        return this.band_id
    }

    public setId(id: string) {
        this.id = id
    }

    public setWeek_day(week_day: WeekDay) {
        this.week_day = week_day
    }

    public setStart_time(start_time: number) {
        this.start_time = start_time
    }

    public setEnd_time(end_time: number) {
        this.end_time = end_time
    }

    public setBand_id(band_id: string) {
        this.band_id = band_id
    }

    public static toWeekDayEnum(data?: any): WeekDay {
        switch (data) {
            case "FRIDAY":
                return WeekDay.FRIDAY
            case "SATURDAY":
                return WeekDay.SATURDAY
            case "SUNDAY":
                return WeekDay.SUNDAY    
            default:
                throw new CustomError(422, "Invalid WeekDay, shows are on FRIDAY, SATUDAY or SUNDAY only")
        }
    }

    public static toShow(data?: any) {
        return (data && new Show(
            data.id,
            Show.toWeekDayEnum(data.week_day),
            data.start_time,
            data.end_time,
            data.band_id
        ))
    }
}

export enum WeekDay {
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export interface ShowInputDTO{
    week_day: WeekDay,
    start_time: number,
    end_time: number,
    band_id: string
}

export interface ShowOutputDTO{
    id: string,
    week_day: WeekDay,
    start_time: number,
    end_time: number,
    band_id: string,
    music_genre?: string,
    band_name?: string
}