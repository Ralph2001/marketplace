# Marketplace

A modern marketplace web application built with [Next.js](https://nextjs.org), Supabase, and Tailwind CSS. Users can browse, search, and post listings for various categories, message sellers, and manage their own listings.

## Features

- User authentication (sign up, login, logout) via Supabase
- Create, preview, and publish listings with image uploads and compression
- Browse and search listings by category or keyword
- Responsive sidebar navigation and clean UI
- View item details and message sellers (email + notification)
- Real-time notifications for new messages
- Optimized image handling and preview gallery
- Built-in toast notifications for user feedback

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying [`src/app/page.tsx`](src/app/page.tsx). The page auto-updates as you edit the file.

## Project Structure

- `src/app/` — Main Next.js app directory (pages, API routes)
- `src/components/` — UI and layout components
- `constants/` — Static data (e.g., categories)
- `context/` — React context providers (e.g., Auth)
- `libs/` — Utility libraries (e.g., Supabase client)
- `utils/` — Utility functions (e.g., image compression)

## Future Updates

- **More Form Validation:**  
  Add stricter validation for all forms (e.g., required fields, price/email format, image type/size checks).

- **Improve UI for Mobile:**  
  Enhance mobile responsiveness and usability, including better navigation and optimized layouts for small screens.

- **Real-Time Chats:**  
  Implement real-time chat between buyers and sellers, replacing or supplementing the current email-based messaging.

- **User Profiles & Listings Management:**  
  Allow users to edit their profiles, view their listings, and manage messages in a dedicated dashboard.

- **Better Error Handling:**  
  Improve error messages and fallback UI for failed network requests or server errors.

- **Performance Optimizations:**  
  Optimize image loading, implement caching, and improve overall app speed.

- **Admin Panel:**  
  Add an admin interface for moderating listings and managing users.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.