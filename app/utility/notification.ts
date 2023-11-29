import twilio from "twilio";

const accountSid = "AC05a8f6a04a85d017b77fd18e05dd4788";
const authToken = "aad7e442b30dc54772fadeddd0500585";
const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {
  const code = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { code, expiry };
};

export const SendVerificationCode = async (
  code: number,
  toPhoneNumber: string
) => {
  const response = await client.messages.create({
    body: `Your verification code is ${code} it will expire within 30 minutes.`,
    from: "+13604194149",
    to: toPhoneNumber.trim(),
  });
  console.log(response);
  return response;
};
