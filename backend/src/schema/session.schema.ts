import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "The email is required",
    }),
    password: string({
      required_error: "The password is required",
    }),
  }),
});
