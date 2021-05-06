import { ShowInputDTO, WeekDay } from "../src/business/entities/Show";
import { ShowBusiness } from "../src/business/ShowBusiness";


const token = jest.fn(()=> {
    return { id: "id", role: "ADMIN" };
});

const validateShowByDate = jest.fn(
    (week_day: string, start_time: number, end_time: number): any => {
        return [{ show: "show" }];
    }
);

describe("Testing createShow Business", () => {
    const authenticator = { getData: token } as any
    const idGenerator = { generate: jest.fn() } as any
    const showDataBase = {
        createBand: jest.fn(),
        getShowByDate: validateShowByDate
    } as any
    const bandDatabase = { registerBand: jest.fn() } as any


    
    test("Should return invalid date error", async () => {
        expect.assertions(2)

        const showBusiness: ShowBusiness = new ShowBusiness(
            idGenerator,
            authenticator,
            showDataBase,
            bandDatabase
        )

        const token = "roleAdmin"
    
        const input: ShowInputDTO = {
            band_id: "1",
            week_day: WeekDay.FRIDAY,
            start_time: 22,
            end_time: 19,
        }

        try {
            await showBusiness.createShow(input, token)
        } catch (error) {
            console.log(error)
            expect(error.message).toBe("Shows must be from 8 to 23 and start_time cannot be earlier than end_time")
            expect(error.statusCode).toBe(422)
        }
    })

    test("Should return show_time unavailable when there is already a show", async () => {
        expect.assertions(2)

        const showBusiness: ShowBusiness = new ShowBusiness(
            idGenerator,
            authenticator,
            showDataBase,
            bandDatabase
        )

        const token = "roleAdmin"
        
        const input: ShowInputDTO = {
            band_id: "1",
            week_day: WeekDay.FRIDAY,
            start_time: 8,
            end_time: 10
        }

        try {
            await showBusiness.createShow(input, token)
        } catch (error) {
            expect(error.message).toBe("show_time unavailable, try a different time")
            expect(error.statusCode).toBe(422)
        }
    })
})