import twilio from 'twilio';

import 'dotenv/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

async function createCall() {
  const client = twilio(accountSid, authToken);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Connect><Stream url="wss://${process.env.SERVER_BASE_URL}/twilio/agent"/></Connect></Response>`;

  const call = await client.calls.create({
    from: process.env.FROM_NUMBER!,
    to: process.env.TO_NUMBER!,
    twiml: twiml,
    record: true
  });

  console.log(call.sid);
}

createCall();
