import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USER = 'karandaduretwo@gmail.com'
SMTP_PASSWORD = 'mjpgwzhwdtdoigth'
FROM_EMAIL = 'karandaduretwo@gmail.com'
FROM_NAME = 'daily quotes service'

def send_email(to_email, message):
    """Send an email using the SMTP server."""
    if not isinstance(message, dict):
        raise ValueError("Message should be a dictionary with 'quote' and 'author_name' keys.")

    # Extract the quote and author_name from the message dictionary
    quote = message.get('quote')
    author_name = message.get('author_name')
    print(quote,author_name)

    if not quote or not author_name:
        raise ValueError("The message dictionary should contain 'quote' and 'author_name' keys with non-empty values.")

    # Format the message content
    email_content = f'"{quote}"\n\n- {author_name}'

    msg = MIMEMultipart()
    msg['From'] = FROM_NAME
    msg['To'] = to_email
    msg['Subject'] = 'Daily Quote'

    # Add the message content
    msg.attach(MIMEText(email_content, 'plain'))

    try:
        print("tryblovk starting")
        # print(SMTP_PASSWORD,SMTP_PORT,SMTP_USER,SMTP_SERVER)
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)

        print(SMTP_PORT,SMTP_SERVER)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        print(SMTP_USER,SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        
        server.close()
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")