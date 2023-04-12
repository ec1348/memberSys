const PERMISSION_INIT_DATA = [
  {
    id: 1,
    name: 'member',
    description: "This is the default role assigned to individuals who sign up for the web application. They have the basic access to the application's feature.",
  },
  {
    id: 2,
    name: 'admin',
    description: "System administrators have access to all areas of the application.",
  },
  {
    id: 3,
    name: 'Moderator',
    description: "Moderators have limited administrative privileges and are responsible for monitoring and mangaing user-generated content.",
  },
]

module.exports = async (db) => {
  await db.Permission.bulkCreate(PERMISSION_INIT_DATA)
}