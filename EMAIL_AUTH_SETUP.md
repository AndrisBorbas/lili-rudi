# Email-Based Authentication Setup

## Overview

This project uses email-based authentication with magic links instead of OAuth. When users submit the form, they provide their email address and receive a magic link they can use to edit their response later.

## How It Works

1. **Form Submission**: Users fill out the form and provide their email address
2. **Storage**: The response is stored in Cloudflare R2 using a hash of the email as the key
3. **Magic Link**: A unique token is generated and emailed to the user
4. **Editing**: Users can click the magic link to edit their response anytime

## Required Services

### 1. Cloudflare R2 (Storage)

- Sign up at [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- Create a bucket for storing responses
- Generate API tokens with read/write permissions
- Add credentials to `.env`:
  ```
  R2_ACCOUNT_ID=your_account_id
  R2_ACCESS_KEY_ID=your_access_key
  R2_SECRET_ACCESS_KEY=your_secret_key
  R2_BUCKET_NAME=your_bucket_name
  ```

### 2. Resend (Email Service)

- Sign up at [Resend](https://resend.com/)
- Verify your domain or use their test domain for development
- Generate an API key
- Update the "from" email in `src/lib/email.ts`
- Add API key to `.env`:
  ```
  RESEND_API_KEY=your_resend_api_key
  ```

### 3. Application URL

Set your application URL in `.env`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000  # for development
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # for production
```

## Features

- **No expiry**: Magic links work indefinitely after the first submission
- **Overwrite behavior**: Submitting with the same email overwrites previous responses
- **Secure tokens**: Uses cryptographically secure random tokens
- **Email hashing**: Email addresses are hashed (SHA-256) for storage privacy

## API Routes

- `POST /api/response` - Submit a new response or update existing
- `GET /api/response/[token]` - Retrieve response data using magic link token

## Email Template

The magic link email is in Hungarian and can be customized in `src/lib/email.ts`.

## Development

Make sure to create a `.env` file based on `.env.example` and fill in all required values before running the development server.
