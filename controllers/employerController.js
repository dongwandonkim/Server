const Employer = require('../models/user/employer');
const Location = require('../models/location/location');
const EmployersService = require('../service/employerService');

const employerService = new EmployersService();

// email validation
const check_email = async (req, res) => {
  try {
    const checkEmail = await Employer.checkIfEmailExist(req.body.email);
    if (checkEmail) throw new Error('이미 가입된 이메일');
    res.status(200).send({ message: 'Email is valid' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createEmployer = async (req, res) => {
  try {
    const newEmployer = await employerService.createEmployer(req.body);
    res.status(201).send({ success: true, newEmployer });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getEmployerProfile = async (req, res) => {
  try {
    const employer = await employerService.getEmployerProfile(req.owner);
    res.send({ success: true, employer });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const updateEmployerProfile = async (req, res) => {
  const { name, password, newPassword } = req.body;
  try {
    const employer = await employerService.updateEmployerProfile(
      req.owner,
      name,
      password,
      newPassword
    );
    return res.send({ success: true, employer });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

const logoutEmployer = async (req, res) => {
  try {
    req.owner.tokens = req.owner.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.owner.save();
    res.send({
      message: 'Logged out',
    });
  } catch (error) {
    res.status(500).send();
  }
};

const killAllSession = async (req, res) => {
  try {
    req.owner.tokens = [];
    await req.owner.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await employerService.getEmployersAllLocation(req.owner);
    res.send({ success: true, locations });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
};

module.exports = {
  check_email,
  createEmployer,
  getEmployerProfile,
  updateEmployerProfile,
  getAllLocations,
  logoutEmployer,
  killAllSession,
};
