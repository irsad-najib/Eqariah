import { z } from 'zod';

export const registerSchema = z.object({
    mosqueName: z.string().min(1, "Mosque name is required"),
    street: z.string().min(1, "Street is required"),
    rt: z.string().min(1, "RT is required"),
    rw: z.string().min(1, "RW is required"),
    village: z.string().min(1, "Village is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    mosqueAdmin: z.string().min(1, "Mosque administrator name is required"),
    contactPerson: z.string().min(1, "Contact person is required")
});