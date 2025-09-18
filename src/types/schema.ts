import * as zod from "zod"

export const UserSchema = zod.object({
  id: zod.uuid(),
  firstname: zod
    .string()
    .trim()
    .min(1, {
      message: "First name is required",
    })
    .max(50, { message: "The first name can have a maximum of 50 characters" }),
    
  lastname: zod
    .string()
    .trim()
    .min(1, {
      message: "Last name name is required",
    })
    .max(50, { message: "The last name can have a maximum of 50 characters" }),
  homeaddress: zod
    .string()
    .trim()
    .min(1, {
      message: "Home Address name is required",
    })
    .max(50, {
      message: "The home address can have a maximum of 50 characters",
    }),
})

export const ContactSchema = zod.object({
  id: zod.uuid(),
  phonenumber: zod
    .string()
    .trim()
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .min(6, { message: "Phone number must have at least 6 digits" })
    .max(15, { message: "Phone number can have a maximum of 15 digits" }),
  email: zod
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .max(50, { message: "The email can have a maximum of 50 characters" }),
  userid: zod.uuid(),
})

