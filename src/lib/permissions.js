export const EDITOR_USERS = [
  '2f10d549-4a0b-4e04-a8b9-2d7e9e45c032',  // James
  '2b51ba78-3204-481b-bbda-548fa76b29e5',  // Lars
  '59ef27b6-2d56-4ce1-9569-d5077867596e'   // Ciaran
]

export const canUserEdit = (userId) => {
  return EDITOR_USERS.includes(userId)
}
