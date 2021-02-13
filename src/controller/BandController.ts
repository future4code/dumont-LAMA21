import { Request, Response } from "express"
import { BandBusiness } from "../business/BandBusiness";
import { BandInputDTO } from "../business/entities/Band";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { BandDatabase } from "../data/BandDatabase";

const bandBusiness = new BandBusiness(
    new IdGenerator(),
    new Authenticator(),
    new BandDatabase()
)

export class BandController {
    async registerBand(req: Request, res: Response) {
        try {
            const input: BandInputDTO = {
                name: req.body.name,
                music_genre: req.body.music_genre,
                responsible: req.body.responsible
            }

            await bandBusiness.registerBand(input, req.headers.authorization as string)

            res.status(200).send("Band registered!")

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message });
        }
    }

    async bandDetails(req: Request, res: Response) {
        try {
            const input = (req.query.id ?? req.query.name) as string

            const band = await bandBusiness.getBandDetails(input)

            res.status(200).send({bandDetails: band})

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message });
        }
    }
}