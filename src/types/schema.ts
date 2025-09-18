import * as zod from "zod"

export const UserSchema = zod.object({
  id: zod.uuid(),
  firstName: zod
    .string()
    .trim()
    .min(1, { message: "First name must be a string" })
    .max(50, { message: "The first name can have a maximum of 50 characters" }),
  lastName: zod
    .string()
    .trim()
    .min(1, { message: "Last name must be a string" })
    .max(50, { message: "The last name can have a maximum of 50 characters" }),
  homeAddress: zod
    .string()
    .trim()
    .min(1, { message: "Home Address must be a string" })
    .max(50, {
      message: "The home address can have a maximum of 50 characters",
    }),
})

export const ContactSchema = zod.object({
  id: zod.uuid(),
  phoneNumber: zod
    .string()
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .min(6, { message: "Phone number must have at least 6 digits" })
    .max(15, { message: "Phone number can have a maximum of 15 digits" }),
  email: zod
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(50, { message: "The email can have a maximum of 50 characters" }),
  userId: zod.uuid(),
})
