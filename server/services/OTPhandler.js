
module.exports = {
  sendOTPVerificationEmail: async( {_id, email}, res)=>{
    
      try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // mail options
        const mailOptions = {
          from: '"OTPEmailServer"<info@next.io>',
          to: email,
          subject: "Verify Your Email",
          html: ` <p> Use this OTP:<b> ${otp} </b> to complete your registration </p> 
      <p> This OTP expires in 1 Hour</p>`,
        };

        const salt = 10;
        const newOtp = await bcrypt.hash(otp, salt);

        const newOTPVerification = await new UserOtpVerification({
          userId: _id,
          hashedOtp: newOtp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000, // + 1 hour in milliseconds
        });

        // save to Database
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.status(200).json({
          status: "Pending",
          message: "Verification OTP Email Sent",
          data: {
            userId: _id,
            email,
          },
        });
      } catch (error) {
        res.status(500).json({
          status: "Failed",
          message: error.message,
        });
      }
  }
};