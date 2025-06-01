const User = require('../models/User');
const Expert = require('../models/Expert');
const bcrypt = require('bcryptjs');

exports.setupUserProfile = async (req, res) => {
  try {
    const {
      name, phone, email, skills, type, businessName, website,
      businessCategory, city, state, country, rememberSettings,
    } = req.body;

    const certificateUrl = req.file?.path;

    const user = await User.findOneAndUpdate(
      { phone },
      {
        name,
        email,
        skills,
        type,
        address: { city, state, country },
        businessName: type === 'startup-founder' ? businessName : undefined,
        website: type === 'startup-founder' ? website : undefined,
        businessCategory: type === 'startup-founder' ? businessCategory : undefined,
        certificateUrl: type === 'startup-founder' ? certificateUrl : undefined,
        rememberSettings,
      },
      { new: true }
    );

    res.status(200).json({ message: 'User profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};

exports.setupExpertProfile = async (req, res) => {
  try {
    const {
      name, phone, email, password, city, state, country,
      skills, type, rememberSettings,
      companyName, website, officeAddress, gstin, industryCategory,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const registrationCertUrl = req.file?.path;

    const expert = new Expert({
      name,
      phone,
      email,
      password: hashedPassword,
      skills,
      type,
      address: { city, state, country },
      companyName,
      website,
      officeAddress,
      gstin,
      registrationCertUrl,
      industryCategory,
      rememberSettings,
    });

    await expert.save();
    res.status(201).json({ message: 'Expert profile created', expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Expert creation failed' });
  }
};
