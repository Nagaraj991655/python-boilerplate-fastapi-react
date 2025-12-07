import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_verification_email(email: str, token: str) -> bool:
    """
    Send email verification link to user.
    This is a stub implementation for future email verification feature.

    In production, implement with aiosmtplib or a service like SendGrid/Mailgun.
    """
    verification_link = f"http://localhost:8000/api/v1/auth/verify?token={token}"

    logger.info(f"[EMAIL STUB] Verification email would be sent to: {email}")
    logger.info(f"[EMAIL STUB] Verification link: {verification_link}")

    # TODO: Implement actual email sending
    # Example with aiosmtplib:
    # message = MIMEText(f"Click here to verify: {verification_link}")
    # message["Subject"] = "Verify your email"
    # message["From"] = settings.EMAILS_FROM_EMAIL
    # message["To"] = email
    # await aiosmtplib.send(message, hostname=settings.SMTP_HOST, ...)

    return True


async def send_password_reset_email(email: str, token: str) -> bool:
    """
    Send password reset link to user.
    This is a stub implementation.
    """
    reset_link = f"http://localhost:8000/api/v1/auth/reset-password?token={token}"

    logger.info(f"[EMAIL STUB] Password reset email would be sent to: {email}")
    logger.info(f"[EMAIL STUB] Reset link: {reset_link}")

    return True
