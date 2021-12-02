import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password to short - should be minimun 6 characters"),
    comparePassword: string({
      required_error: "Password confirmation is requiered",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password == data.comparePassword, {
    message: "Passwords do not match",
    path: ["Password confirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.comparePassword"
>;
