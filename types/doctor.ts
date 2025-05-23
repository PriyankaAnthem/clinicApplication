export interface Doctor {
  id:string
  _id: string;
  name: string;
  specialty: string;
  email: string;
  password?: string; // optional if not always present
}

// Input type for creating a doctor (no _id yet)
export type CreateDoctorInput = Omit<Doctor, "_id">;

// Return type of addDoctor function
export type AddDoctorResult = {
  success: boolean;
  doctor?: Doctor;
  message?: string;
};
