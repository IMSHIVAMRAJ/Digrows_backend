const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  const { investorId, pitchId, scheduledTime } = req.body;

  const appointment = await Appointment.create({
    startupId: req.user.id,
    investorId,
    pitchId,
    scheduledTime
  });

  res.status(201).json({ success: true, appointment });
};

exports.getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ startupId: req.user.id }).populate('investorId pitchId');
  res.json({ success: true, appointments });
};
