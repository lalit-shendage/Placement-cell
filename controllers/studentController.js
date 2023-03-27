const Company = require('../models/company');
const Student = require('../models/student');

// render create student page
module.exports.createStudentPage = async function (req, res) {
  return res.render('addstudent');
};

// create student
module.exports.createStudent = async function (req, res) {
  const {
    name,
    batch,
    college,
    status,
    dsaScore,
    webDScore,
    reactScore,
  } = req.body;
  try {
    const student = await Student.findOne({ name });

    if (student) {
      console.log('Email already exists');
      return res.redirect('back');
    }

    const newStudent = await Student.create({
      name,
      college,
      batch,
      status,
      dsaScore,
      webDScore,
      reactScore,
    });
    await newStudent.save();

    return res.redirect('/');
  } catch (error) {
    console.log(`Error in creating student: ${error}`);
    return res.redirect('back');
  }
};

module.exports.studentDetails=async function(req, res){
  const{id} =req.params
  console.log(id)
  try{
  const student = await Student.findById(id);
  return res.render('studentdetails',{student});
  }
  catch(error){
    console.log('Error in fetching student details');
    return res.redirect('back');
  }
};

// delete student
module.exports.deleteStudent = async function (req, res) {
  const { id } = req.params;
  try {
    // find the student using id in params
    const student = await Student.findById(id);

    // find the companies for which interview is scheduled
    // and delete student from company interviews list
    if (student && student.interviews.length > 0) {
      for (let item of student.interviews) {
        const company = await Company.findOne({ name: item.company });
        if (company) {
          for (let i = 0; i < company.students.length; i++) {
            if (company.students[i].student.toString() === id) {
              company.students.splice(i, 1);
              company.save();
              break;
            }
          }
        }
      }
    }
    await Student.findByIdAndDelete(id);
    res.redirect('back');
  } catch (error) {
    console.log('Error in deleting student');
    return res.redirect('back');
  }
};
