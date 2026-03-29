from twilio.rest import Client

from app.configs.settings import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_OTP_CONTENT_SID, TWILIO_WHATSAPP_FROM_NUMBER


client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_whatsapp_otp(to_number, otp_code):
    message = client.messages.create(
        content_sid=TWILIO_OTP_CONTENT_SID,
        to=f"whatsapp:{to_number}",
        from_=f"whatsapp:{TWILIO_WHATSAPP_FROM_NUMBER}",
        content_variables=f'{{"1": "{otp_code}"}}'
    )
    return message.sid
