import * as zod from "zod"

export const UserSchema = zod.object({
  id: zod.uuid(),
  username: zod
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username can have a maximum of 50 characters" })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message:
        "Username can only contain letters, numbers, dots, underscores, and dashes",
    }),
  firstname: zod
    .string()
    .trim()
    .min(1, {
      message: "First name is required",
    })
    .max(50, { message: "The first name can have a maximum of 50 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "First name must contain only letters",
    }),

  lastname: zod
    .string()
    .trim()
    .min(1, {
      message: "Last name name is required",
    })
    .max(50, { message: "The last name can have a maximum of 50 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Last name must contain only letters",
    }),
  homeaddress: zod
    .string()
    .trim()
    .min(1, {
      message: "Home Address name is required",
    })
    .max(50, {
      message: "The home address can have a maximum of 50 characters",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Home address must contain only letters",
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
  username: zod
    .string()
    .trim(),
})
