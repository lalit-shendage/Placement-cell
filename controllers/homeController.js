const Student = require('../models/student');

// render home page
module.exports.homePage = async function (req, res) {
  const students = await Student.find({});
  return res.render('studentlist', { students });
};
