// Get all the members
exports.queryMembers = (req, res) => {
    res.send([{
        id: 1, 
        firstName: 'Eric',
        LastName: 'Chen',
        age: 27
    }])
};