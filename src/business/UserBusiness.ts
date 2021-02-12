import { UserInputDTO, LoginInputDTO, UserRole } from "./entities/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator,
      private userDatabase: UserDatabase,
   ) { }

   async createUser(user: UserInputDTO) {

      try {
         if (!user.name || !user.email || !user.password || !user.role) {
            throw new CustomError(422, 'Fields name, email, password and role must be provided');
         }

         if (user.email.indexOf("@") === -1) {
            throw new CustomError(422, "Email address must have an @");
         }

         if (user.password.length < 6) {
            throw new CustomError(422, "Invalid password, your password must have more than 6 characters");
         }

         if (user.role !== "ADMIN" && user.role !== "NORMAL") {
            throw new CustomError(422, "The field role must be either ADMIN or NORMAL")
         }

         const id = this.idGenerator.generate();

         const hashPassword = await this.hashManager.hash(user.password);

         await this.userDatabase.createUser(
            id,
            user.email,
            user.name,
            hashPassword,
            user.role
         );

         const accessToken = this.authenticator.generateToken({
            id,
            role: user.role
         });

         return accessToken;

      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   async getUserByEmail(user: LoginInputDTO) {

      try {
         if (!user.email || user.email.indexOf("@") === -1) {
            throw new CustomError(422, 'The field email must be provided and it must have an @ character')
         }

        if (!user.password) {
         throw new CustomError(422, 'The field password must be provided')
         }

         const userFromDB = await this.userDatabase.getUserByEmail(user.email);

         if (!userFromDB) {
            throw new CustomError(401, "User not found");
         }

         const passwordIsCorrect = await this.hashManager.compare(
            user.password,
            userFromDB.password
         );

         if (!passwordIsCorrect) {
            throw new CustomError(401, "Field password is incorrect, please try again");
         }

         const accessToken = this.authenticator.generateToken({
            id: userFromDB.id,
            role: userFromDB.role
         });

         return accessToken;
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}
