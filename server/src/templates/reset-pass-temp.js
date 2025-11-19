export const resetpassTemplate = (token) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #2563eb;
      padding: 30px 0;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-weight: 600;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .welcome-text {
      font-size: 18px;
      margin-bottom: 25px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #666666;
      font-size: 14px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 15px;
    }
    .signature {
      margin-top: 25px;
      border-top: 1px solid #eeeeee;
      padding-top: 20px;
    }
    .token {
      font-family: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace;
      font-weight: 700;
      font-size: 28px;
      letter-spacing: 0.35em;
      margin: 20px 0;
      display: inline-block;
      background: #f8fafc;
      padding: 12px 18px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      color: #0f172a;
    }
  </style>
</head>
<body>


  <div class="header">
    <h1>Password Reset</h1>
  </div>
  
  <div class="content">
      
   
    <p>You requested a password reset.</p>
  <p class="token" aria-label="password reset token">${token}</p>
    <p>please enter this code within 5 minutes, do not share this code with anyone</p>
    <p>This code will expire in 5 minutes.</p>

   
    <div class="signature">
      <p>Best regards,</p>
      <p><strong>The Dev-Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Infitech Labs. All rights reserved.</p>
      <p>123 Nairobi Street, Kenya</p>
      <p> <a href="https://arieljoe.me">Our Website</a></p>
      <p><small>You're receiving this email because you registered for an account.</small></p>
    </div>
  </div>
</body>
</html>
`;
