
# Drip | E-commerce App

Drip is a TypeScript-based Full stack e-commerce application designed to facilitate online shopping with features for e-commerce platform. The project utilizes TypeScript, TailwindCSS, Neon, Drizzle, Stripe etc..





## Tech Stack

- **Uploadthing**: s3 bucket wrapper for blob storage.
- **Resend**: Email Notification provider.
- **TypeScript**: Provides type safety and enhances code quality.
- **CSS**: Used for styling the application.
- **Drizzle**: Utilized for database operations and ORM functionalities.
- **Neon**: Employed for serverless database management.
- **Next.js**: A React framework used for building the user interface.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Stripe**: Integrated for payment processing.
- **React Hook Form**: Used for managing form state and validation.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **React**: The core library used for building the user interface.
- **Postgres**: The database used for storing application data.
- **Eslint and Prettier**: Tools for maintaining code quality and formatting.
- **Agloia Search**: vector/sematic powered search.
## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Younis-ahmed/drip.git
   cd drip 
   ```

2. Install dependencies:
    ```sh
    pnpm install
    ```
3. Set up environment variables: Create a .env.local file in the root directory and add the necessary environment variables. You can use the provided .env.local file as a reference.

4. Run the development server:
    ```sh
    pnpm run dev
    ```
5. Build the project:
    ```sh
    pnpm run build
    ```
6. Start the production server:
    ```sh
    pnpm run start
    ```
7. Lint the code:
    ```sh
    pnpm run lint
    ```
8. Format the code:
    ```sh
    pnpm run format
    ```
9. Run type checks:
    ```sh
    pnpm run typecheck
    ```
10. Database operations:

Generate database schema:
    ```sh
    pnpm run db:generate
    ```

Push database schema:
    ```sh
    pnpm run db:push
    ```
    
11. Stripe webhook listener:
    ```sh
    pnpm run stripe:listen
    ```




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

**Neon and Postgres environment variables**


`POSTGRES_URL`

`DB_HOST`

`DB_USER`

`DB_PASSWORD`

`DB_NAME`

`DEV_DB_HOST`

`DEV_DB_USER`

`DEV_DB_PASSWORD`

`DEV_DB_NAME`


**OAuth2 environment variables**

`GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET`

`TWITTER_CLIENT_ID`

`TWITTER_CLIENT_SECRET`

**next-auth**

`AUTH_SECRET`


**Resend api key**

`RESEND_API_KEY`

**Email environment variables for Resend API**

`EMAIL`


**uploadthing s3 bucket wrapper**

`UPLOADTHING_SECRET`

`UPLOADTHING_APP_ID`

`UPLOADTHING_TOKEN`

**Algolia environment variables**

`NEXT_PUBLIC_ALGOLIA_APP_ID`

`NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`

`ALGOLIA_WRITE_KEY`

**Stripe environment variables**

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

`STRIPE_SECRET_KEY`

`STRIPE_WEBHOOK_SECRET`
## API Reference

#### Handles authentication-related requests

```http
  GET /api/auth/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Handles actions such as signing in,

```http
  POST /api/auth/signin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### Handles actions such as signing out,
```http
  POST /api/auth/signout
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### Handles actions such as session,
```http
  GET /api/auth/session
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |

#### Handles actions such as callback,
```http
GET /api/auth/callback/:provider
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string` | **Required**. Your API key |
| `provider` | `string` | **Required**. The provider name|

#### Endpoint: Handles Stripe Webhook Events

**Webhook Event**

This endpoint handles Stripe webhook events. It verifies the event signature and processes the event accordingly.


```http
POST /api/stripe/webhook
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `stripe-signature`      | `string` | **Required**. The signature to verify the event |

#### Endpoint: Handles File Uploads using UploadThing

**Avatar Upload**

This endpoint handles avatar image uploads. It allows users to upload images with a maximum file size of 2MB.

```http
POST /api/uploadthing/avatarUploader
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `file` | **Required**. The image file to upload |

**Variant Upload**

This endpoint handles variant image uploads. It allows users to upload up to 10 images.
```http
POST /api/uploadthing/variantUploader
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `file[]	` | **Required**. The image file to upload |


#### Endpoint: Handles New Password Form

New Password
This endpoint serves the new password form, allowing users to reset their password.

```http
GET /auth/new-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |

#### Endpoint: Handles Email Verification Form

Email Verification
This endpoint serves the email verification form, allowing users to request a new verification token.



```http
GET /auth/new-verification-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |


#### Endpoint: Handles User Registration

User Registration
This endpoint serves the user registration form, allowing users to create a new account

```http
GET /auth/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |


#### Endpoint: Handles Password Reset
Password Reset
This endpoint serves the password reset form, allowing users to reset their password. 

```http
GET /auth/reset
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |


#### Endpoint: Handles Adding a New Product
Add Product
This endpoint serves the form for adding a new product. It ensures that only users with the ADMIN role can access the form.

```http
GET /dashboard/add-product
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |


#### Endpoint: Handles Analytics Dashboard
Analytics Dashboard
This endpoint serves the analytics dashboard, providing insights into recent orders and sales data.

```http
GET /dashboard/analytics
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |


#### Endpoint: Handles Orders Dashboard
Orders Dashboard
This endpoint serves the orders dashboard, providing a detailed view of recent orders.

```http
GET /dashboard/orders
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |

#### Endpoint: Handles Products Dashboard
Products Dashboard
This endpoint serves the products dashboard, providing a detailed view of all products and their variants.

```http
GET /dashboard/products
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |

#### Endpoint: Handles User Settings
User Settings
This endpoint serves the user settings page, allowing authenticated users to view and update their settings

```http
GET /dashboard/settings
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `string	` | **Required**.  Your API key |

## Datagase Schema

![diagram-export-1-13-2025-4_56_45-PM](https://github.com/user-attachments/assets/aa942c2e-b095-49de-82e6-4f18431f4c79)


