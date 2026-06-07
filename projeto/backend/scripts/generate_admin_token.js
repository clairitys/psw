const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { connectMongo } = require('../config/database');
const User = require('../models/User');
const { getToken } = require('../middleware/auth');

(async function(){
  try{
    await connectMongo();
    const emailOrUsername = process.argv[2];
    if(!emailOrUsername){
      console.error('Usage: node generate_admin_token.js <email_or_username>');
      process.exit(1);
    }

    const query = emailOrUsername.includes('@') ? { email: emailOrUsername.toLowerCase() } : { username: emailOrUsername.toLowerCase() };
    const user = await User.findOne(query);
    if(!user){
      console.error('User not found for', emailOrUsername);
      process.exit(2);
    }

    if(!user.isAdmin){
      console.warn('User found but isAdmin is false. Token will still be generated.');
    }

    const token = getToken({ id: user._id });
    console.log('TOKEN:', token);
    console.log('USER:', JSON.stringify(user.toJSON(), null, 2));
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(10);
  }
})();
