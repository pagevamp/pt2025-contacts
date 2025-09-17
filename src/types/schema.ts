import * as zod from "zod"

export const UserSchema = zod.object({
  id: zod.uuid(),
  firstName: zod
    .string(`First name must be a string`)
    .trim()
    .max(50, { message: "The first name can have a maximum of 50 characters" }),
  lastName: zod
    .string(`Last name must be a string`)
    .trim()
    .max(50, { message: "The last name can have a maximum of 50 characters" }),
  homeAddress: zod
    .string({message:`Home address must be a string`})
    .trim()
    .max(50, { message: "The home address can have a maximum of 50 characters" }),
})

export const ContactSchema = zod.object({
  id: zod.uuid(),
  phoneNumber: zod
    .number({message : `The Phone number must be a number`})
    .min(6,{message: "The phone number can have a minimum of 6 digits"})
    .max(15,{message: "The phone number can have a maximum of 15 digits"}),
  email: zod
    .email({message:`Last name must be a string`})
    .trim()
    .max(50, {message:"The email can have a maximum of 50 characters"}),
  userId: zod.uuid(),
})