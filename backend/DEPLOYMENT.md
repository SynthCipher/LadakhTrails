Deployment checklist

Required environment variables:

- MONGODB_URI - MongoDB connection URI
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET - Cloudinary config
- ADMIN_EMAIL - admin login email for JWT admin route
- ADMIN_PASSWORD - admin login password for JWT admin route (also used for legacy admin fallback)
- JWT_SECRET - secret to sign JWTs
- FRONTEND_URL - (optional) frontend URL to restrict CORS
- PORT - (optional) server port

Notes:

- The project already includes `vercel.json` for deployment on Vercel.
- Use `npm start` to run the server in production. `npm run server` runs nodemon locally.
- Admin can login via `POST /api/user/admin` with {email, password} to receive a token.
- Booking status can be updated via `PUT /api/tour/booking/status` using a valid token or with header `x-admin-password` if using the local admin panel.
