import { TypeOf, object, string } from "zod";

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is a required field.",
    }).email("Please enter a valid email adress"),
    password: string({
      required_error: "Password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
  }),
});

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is a required field.",
    }).email("Please enter a valid email adress"),
    password: string({
      required_error: "Password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
    confirmPassword: string({
      required_error: "Confirm password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  }),
});

const params = {
  params: object({
    user_id: string({
      required_error: "User ID is required.",
    }),
  }),
};

export const getUserByIdSchema = object({ ...params });

export type GetUserByIdInput = TypeOf<typeof getUserByIdSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
