import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Orgs from "../models/orgs";

const SendEmailToCustomer = async (req: Request, res: Response) => {
  const { name, phoneNumber, email, text, orgId } = req.body;

  if (!name || !phoneNumber || !email || !text) {
    return res.status(400).send({
      status: "failed",
      error: "All fields are required."
    });
  }

  console.log("================== New Request ==================");
  console.log(
    `SendEmailToCustomer::OrgId: ${orgId} | Name: ${name} | phoneNumber: ${phoneNumber}`
    + ` | Email: ${email} | Text: ${text}`
  );

  let org = null;
  try {
    org = await Orgs.findById(orgId);
  } catch (error: any) {
    // do nothing as it's already handled below
  }
  if (org == null) {
    console.log(`SendEmailToCustomer::OrgId: ${orgId} | Org not found`);
    return res.status(400).send({
      status: "failed",
      error: "URL is malformed. Please request new one."
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const rawText = `<p>Hey <strong>${org.name}</strong>,</p>
<p>You have received a new inquiry with the following details:</p>

<table border="1" cellpadding="5" cellspacing="0">
    <tr>
        <td><strong>Name:</strong></td>
        <td>${name}</td>
    </tr>
    <tr>
        <td><strong>Phone Number:</strong></td>
        <td>${phoneNumber}</td>
    </tr>
    <tr>
        <td><strong>Email:</strong></td>
        <td>${email}</td>
    </tr>
    <tr>
        <td><strong>Message:</strong></td>
        <td>${text}</td>
    </tr>
</table>

<p>Please respond to this inquiry at your earliest convenience.</p>
<p>Best regards,</p>
<p>BizBot Team</p>`;

  const mailOptions = {
    from: "BizBot",
    to: org.email,
    subject: "Inquiry Received",
    text: rawText,
    html: rawText
  };

  console.log(`SendEmailToCustomer::OrgId: ${orgId} | Mail Options: ${JSON.stringify(mailOptions)}`);

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.status(200).send({
      status: "success",
      message: "Email sent successfully."
    });
  } catch (error: any) {
    console.error(`SendEmailToCustomer::OrgId: ${orgId} | Error sending email:`, error);
    res.status(500).send({
      status: "failed",
      error: "Failed to send email."
    });
  }
};

export { SendEmailToCustomer };
