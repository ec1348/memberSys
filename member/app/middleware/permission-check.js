// This middleware will handle permission check
// Three common permission role ['member', 'admin', 'moderator']
const db = require('../models')

module.exports = async (req, res, next) => {
  const { member_id } = req
	const member = await db.Member.findOne(
		{
			where: {
				id: member_id,
			},
			include: [{ model: db.Permission}]
		}
	)
	if( !member ) {
		return res.status(404).json({
			message: 'Member not found. Please check the username and try again.'
		})
	}
	req.role = member.Permission.name
	next()
}