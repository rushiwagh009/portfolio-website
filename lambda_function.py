import json
import logging
import os
import re
from typing import Dict, Any, Tuple

import boto3
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
ses_client = boto3.client('ses')

# Environment variables
# E.g., ALLOWED_ORIGIN="https://rushiwagh.dev"
ALLOWED_ORIGIN = os.environ.get('ALLOWED_ORIGIN', 'https://rushiwagh.dev')
# E.g., DESTINATION_EMAIL="rushiwagh009@gmail.com"
DESTINATION_EMAIL = os.environ.get('DESTINATION_EMAIL', 'rushiwagh009@gmail.com')
# E.g., SENDER_EMAIL="no-reply@rushiwagh.dev" (Must be SES verified)
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'rushiwagh009@gmail.com')


def generate_cors_headers(origin: str) -> Dict[str, str]:
    """Generates proper CORS headers based on the allowed origin."""
    if origin == ALLOWED_ORIGIN:
        return {
            'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        }
    return {
        'Access-Control-Allow-Origin': 'null',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }


def build_response(status_code: int, success: bool, message: str, headers: Dict[str, str]) -> Dict[str, Any]:
    """Helper to build consistent JSON responses."""
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps({
            'success': success,
            'message': message
        })
    }


def validate_payload(payload: Dict[str, str]) -> Tuple[bool, str]:
    """Validates the incoming form payload."""
    required_fields = ['name', 'email', 'service', 'message']
    
    # 1. Reject empty required fields
    for field in required_fields:
        if not payload.get(field) or not str(payload.get(field)).strip():
            return False, f"Missing or empty required field: {field}"
            
    # 2. Validate email format
    email_regex = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
    if not email_regex.match(payload.get('email', '')):
        return False, "Invalid email address format."
        
    # 3. Limit message length
    if len(payload.get('message', '')) > 2000:
        return False, "Message is too long (maximum 2000 characters)."
        
    if len(payload.get('name', '')) > 100:
        return False, "Name is too long."
        
    return True, "Valid payload."


def send_admin_notification(payload: Dict[str, str], client_ip: str, user_agent: str) -> None:
    """Sends the detailed consultation request email to the admin."""
    subject = "New Infrastructure Consultation Request"
    body_text = f"""
-----------------------------------
New Infrastructure Consultation
Name: {payload.get('name')}
Email: {payload.get('email')}
Service Requested: {payload.get('service')}
Estimated Budget: {payload.get('budget', 'Not Specified')}
Project Details: {payload.get('message')}
Timestamp: AWS Lambda Exec
Client IP: {client_ip}
User Agent: {user_agent}
-----------------------------------
"""
    body_html = f"""
    <html>
        <head></head>
        <body>
            <h2 style="color: #2c3e50;">New Infrastructure Consultation Request</h2>
            <hr>
            <p><strong>Name:</strong> {payload.get('name')}</p>
            <p><strong>Email:</strong> {payload.get('email')}</p>
            <p><strong>Service Requested:</strong> {payload.get('service')}</p>
            <p><strong>Estimated Budget:</strong> {payload.get('budget', 'Not Specified')}</p>
            <p><strong>Project Details:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff;">
                {payload.get('message')}
            </p>
            <hr>
            <p><small><strong>Client IP:</strong> {client_ip}<br>
            <strong>User Agent:</strong> {user_agent}</small></p>
        </body>
    </html>
    """

    ses_client.send_email(
        Source=SENDER_EMAIL,
        Destination={'ToAddresses': [DESTINATION_EMAIL]},
        Message={
            'Subject': {'Data': subject},
            'Body': {
                'Text': {'Data': body_text},
                'Html': {'Data': body_html}
            }
        },
        ReplyToAddresses=[payload.get('email')]
    )


def send_user_acknowledgement(payload: Dict[str, str]) -> None:
    """Sends a professional acknowledgement email to the user."""
    subject = "Thanks for contacting Rushi Wagh"
    body_text = f"""
Hello {payload.get('name')},

Thank you for reaching out regarding your infrastructure needs. I have received your request for {payload.get('service')}.

I will review your project details and get back to you within 24 hours.

Best regards,
Rushi Wagh
AWS DevOps Consultant
"""
    body_html = f"""
    <html>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a73e8;">Consultation Request Received</h2>
                <p>Hello <strong>{payload.get('name')}</strong>,</p>
                <p>Thank you for reaching out. I have successfully received your request for <strong>{payload.get('service')}</strong>.</p>
                <p>I will review your cloud infrastructure requirements and get back to you within <strong>24 hours</strong>.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>Rushi Wagh</strong><br>
                <span style="color: #666;">AWS DevOps Consultant</span><br>
                <a href="https://rushiwagh.dev" style="color: #1a73e8;">rushiwagh.dev</a></p>
            </div>
        </body>
    </html>
    """

    ses_client.send_email(
        Source=SENDER_EMAIL,
        Destination={'ToAddresses': [payload.get('email')]},
        Message={
            'Subject': {'Data': subject},
            'Body': {
                'Text': {'Data': body_text},
                'Html': {'Data': body_html}
            }
        }
    )


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main Lambda handler triggered by Function URL API calls."""
    try:
        # Extract headers and origin
        headers = event.get('headers', {})
        origin = headers.get('origin', '')
        
        # Determine CORS headers
        cors_headers = generate_cors_headers(origin)
        
        # Handle OPTIONS preflight request
        http_context = event.get('requestContext', {}).get('http', {})
        method = http_context.get('method', event.get('httpMethod', ''))
        
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': ''
            }
            
        # Reject non-POST requests
        if method != 'POST':
            logger.warning(f"Rejected method {method} from IP: {http_context.get('sourceIp')}")
            return build_response(405, False, "Method Not Allowed. Only POST is accepted.", cors_headers)

        # Ensure content type is JSON if specified, but usually we just parse body
        body = event.get('body')
        if not body:
            logger.warning("Empty request body.")
            return build_response(400, False, "Empty request payload.", cors_headers)
            
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            logger.error("Failed to parse JSON body.")
            return build_response(400, False, "Invalid JSON payload.", cors_headers)

        # Validate Payload
        is_valid, validation_msg = validate_payload(payload)
        if not is_valid:
            logger.warning(f"Payload validation failed: {validation_msg}")
            return build_response(400, False, validation_msg, cors_headers)

        # Gather metadata
        client_ip = http_context.get('sourceIp', 'Unknown IP')
        user_agent = headers.get('user-agent', 'Unknown User Agent')
        
        logger.info(f"Processing valid request from {payload.get('email')} IP: {client_ip}")

        # Send emails
        send_admin_notification(payload, client_ip, user_agent)
        send_user_acknowledgement(payload)

        # Success logging and response
        logger.info(f"SES success for {payload.get('email')}")
        return build_response(200, True, "Consultation request submitted successfully.", cors_headers)

    except ClientError as e:
        logger.error(f"AWS SES ClientError: {e.response['Error']['Message']}")
        return build_response(500, False, "Failed to send email due to server error.", cors_headers)
    except Exception as e:
        logger.error(f"Unexpected exception: {str(e)}", exc_info=True)
        return build_response(500, False, "An unexpected error occurred.", cors_headers)
