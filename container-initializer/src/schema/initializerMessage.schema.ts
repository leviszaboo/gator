import { TypeOf, object, string } from "zod";

export const InitializerMessageSchema = object({
  appName: string({
    required_error: "Name is a required field.",
  }),
  userId: string({
    required_error: "Description is a required field.",
  }).regex(
    new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ),
    "ID must be a valid UUID.",
  ),
  appId: string({
    required_error: "Description is a required field.",
  }).regex(
    new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ),
    "ID must be a valid UUID.",
  ),
});

export type InitializerMessage = TypeOf<typeof InitializerMessageSchema>;
