import express from "express";
import { AddressInfo } from "net";
import { bandRouter } from "./controller/routes/bandRouter";
import { showRouter } from "./controller/routes/showRouter";
import { userRouter } from "./controller/routes/userRouter";

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/band", bandRouter);
app.use("/show", showRouter)

const server = app.listen(3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server running in port: http://localhost:${address.port}`);
   } else {
      console.error(`Fail on running server`);
   }
});  