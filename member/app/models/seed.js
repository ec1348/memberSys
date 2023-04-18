const MEMBER_INIT_DATA = [
  {
    userName: 'admin',
    password: '$2b$10$Vx8b0GxHRpQ5GlMdw/maH.DSAH9b5wxL.2XYpudmDmoENfZpkr3Fe', //123456
    email: 'ec1112@gmail.com',
    firstName: 'Admin',
    lastName: 'Chen',
    permission_id: 2
  },
  {
    userName: 'user',
    password: '$2b$10$Vx8b0GxHRpQ5GlMdw/maH.DSAH9b5wxL.2XYpudmDmoENfZpkr3Fe', //123456
    email: 'ec1111@gmail.com',
    firstName: 'User',
    lastName: 'Chen',
    permission_id: 1
  },
  {
    userName: 'moderator',
    password: '$2b$10$Vx8b0GxHRpQ5GlMdw/maH.DSAH9b5wxL.2XYpudmDmoENfZpkr3Fe', //123456
    email: 'ec1113@gmail.com',
    firstName: 'Moderator',
    lastName: 'Chen',
    permission_id: 3
  }
]
const PERMISSION_INIT_DATA = [
  {
    name: 'member',
    description: "This is the default role assigned to individuals who sign up for the web application. They have the basic access to the application's feature.",
  },
  {
    name: 'admin',
    description: "System administrators have access to all areas of the application.",
  },
  {
    name: 'moderator',
    description: "Moderators have limited administrative privileges and are responsible for monitoring and mangaing user-generated content.",
  },
]

module.exports = async (db) => {
  if(process.env.NODE_ENV === 'test'){
    await db.Permission.bulkCreate(PERMISSION_INIT_DATA);
    await db.Member.bulkCreate(MEMBER_INIT_DATA);
  }
  if(process.env.NODE_ENV === 'dev'){
    const p_member = await db.Permission.findOne({ where: { name: 'member'}});
    if(!p_member) await db.Permission.create( PERMISSION_INIT_DATA[0] )
    const p_admin = await db.Permission.findOne({ where: { name: 'admin'}});
    if(!p_admin) await db.Permission.create( PERMISSION_INIT_DATA[1] )
    const p_moderator = await db.Permission.findOne({ where: { name: 'moderator'}});
    if(!p_moderator) await db.Permission.create( PERMISSION_INIT_DATA[2] )
    
    const admin = await db.Member.findOne({ where:{ userName: 'admin' } })
    if(!admin) await db.Member.create( MEMBER_INIT_DATA[0] )
    const user = await db.Member.findOne({ where:{ userName: 'user' } })
    if(!user) await db.Member.create( MEMBER_INIT_DATA[1] )
    const mod = await db.Member.findOne({where:{ userName: 'moderator' }})
    if(!mod) await db.Member.create(MEMBER_INIT_DATA[2])
  }
}