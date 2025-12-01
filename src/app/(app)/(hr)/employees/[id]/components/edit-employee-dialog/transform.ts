import { EmployeeInput } from "@/features/(hr)/employees/services/schemas";

export function transformEmployeeToDb(data: EmployeeInput) {
  return {
    title: data.title || null,
    name: data.name,
    family_name: data.familyName,
    preferred_name: data.preferredName || null,
    gender: data.gender,
    phone_number: data.phoneNumber,
    email: data.email,
    photo: data.photo || null,
    user_id: data.userId || null,
    status: data.status,
    department: data.department || null,
    position: data.position || null,
    join_date: data.joinDate || null,
    salary: data.salary || null,
    emergency_contact: data.emergencyContact || null,
    emergency_phone: data.emergencyPhone || null,
    address: data.address || null,
    city: data.city || null,
    state: data.state || null,
    zip_code: data.zipCode || null,
    country: data.country || null,
  };
}
