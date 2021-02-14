import { BandBusiness } from "../src/business/BandBusiness"
import { BandInputDTO } from "../src/business/entities/Band"

const roleAdminMock = jest.fn(() => {
    return {
        id: "id",
        role: "ADMIN"
    }
})

describe("Testing registerBand Business", () => {
    const authenticator = { getData: roleAdminMock } as any
    const idGenerator = { generate: jest.fn() } as any
    const bandDatabase = { registerBand: jest.fn() } as any


    test("Should return missing name error when name is empty", async () => {
        expect.assertions(2)

        const bandBusiness: BandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const token = "roleAdmin"

        const input: BandInputDTO = {
            name: "",
            music_genre: "Rock",
            responsible: "Dave Grohl"
        }

        try {
            await bandBusiness.registerBand(input, token)

        } catch (error) {
            expect(error.message).toBe('Fields name, musicGenre and resposible must be provided')
            expect(error.statusCode).toBe(422)
        }
    })

    test("Should return missing responsible error when responsible is empty", async () => {
        expect.assertions(2)

        const bandBusiness: BandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const token = "roleAdmin"

        const input: BandInputDTO = {
            name: "Foo Fighters",
            music_genre: "Rock",
            responsible: ""
        }

        try {
            await bandBusiness.registerBand(input, token)

        } catch (error) {
            expect(error.message).toBe('Fields name, musicGenre and resposible must be provided')
            expect(error.statusCode).toBe(422)
        }
    })

    test("Should return missing music_genre error when music_genre is empty", async () => {
        expect.assertions(2)

        const bandBusiness: BandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const token = "roleAdmin"

        const input: BandInputDTO = {
            name: "Foo Fighters",
            music_genre: "",
            responsible: "Dave Grohl"
        }

        try {
            await bandBusiness.registerBand(input, token)

        } catch (error) {
            expect(error.message).toBe('Fields name, musicGenre and resposible must be provided')
            expect(error.statusCode).toBe(422)
        }
    })

    test("Should return sucess message", async () => {
        const bandBusiness: BandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const token = "roleAdmin"

        const input: BandInputDTO = {
            name: "Foo Fighters",
            music_genre: "Rock",
            responsible: "Dave Grohl"
        }

        await bandBusiness.registerBand(input, token)

        expect(bandDatabase.registerBand).toHaveBeenCalled()
        expect(bandDatabase.registerBand).toHaveBeenCalledWith(input)
    })
})