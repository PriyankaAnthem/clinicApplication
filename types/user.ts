export interface User {
 
  _id:string
  id:string //added later
  name: string
  email: string
  role: "patient" | "admin"
}
