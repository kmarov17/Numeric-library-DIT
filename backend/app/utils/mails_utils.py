from fastapi import HTTPException
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.configs.settings import SENDER_EMAIL, SENDER_PASSWORD, SMTP_SERVER, SMTP_PORT, RECIPIENTS


conf = ConnectionConfig(
    MAIL_USERNAME = SENDER_EMAIL,
    MAIL_PASSWORD = SENDER_PASSWORD,
    MAIL_FROM = SENDER_EMAIL,
    MAIL_FROM_NAME='Todou Studio Contact Form',
    MAIL_PORT = SMTP_PORT,
    MAIL_SERVER = SMTP_SERVER,
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = False
)

async def send_contact_form_email(submission):
    name = submission["name"]
    email = submission["email"]
    phone_number = submission["phone_number"]
    message = submission["message"]

    html = f"""
                <!DOCTYPE html>
        <html lang='fr'>
        <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Nouveau message de {name}</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <p>Message de</p>
        <ul>
        <li>Nom: {name}</li>
        <li>Email: {email}</li>
        <li>Phone: {phone_number}</li>
        </ul>
        <br>
        <p>{message}</p>
        </body>
        </html>
    """

    mail = MessageSchema(
        subject=f"Nouveau message de {name}",
        recipients=RECIPIENTS,
        body=html,
        subtype=MessageType.html
    )
    conf.MAIL_FROM_NAME = name
    fm = FastMail(conf)
    await fm.send_message(mail)

