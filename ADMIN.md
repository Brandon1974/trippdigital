# Tripp Digital Admin Dashboard

## Overview

The admin dashboard is a password-protected interface for managing your Tripp Digital website without needing to touch code. You can:

- Manage products (add, edit, remove)
- Write and publish blog posts with rich text formatting
- Add promotional videos (YouTube/Vimeo embeds)
- Upload and manage files

## Accessing the Admin Panel

1. Navigate to `/admin-login.html` on your site
2. Enter your admin password
3. You'll see the admin dashboard with navigation on the left

**URL:** `https://trippdigital.com/admin-login.html`

## Setting Your Admin Password

The default password is set in the environment variable `ADMIN_PASSWORD`. 

**To change it:**

1. Go to your Netlify dashboard for this project
2. Go to **Site settings** → **Build & deploy** → **Environment**
3. Add or update the environment variable:
   - Key: `ADMIN_PASSWORD`
   - Value: Your desired password
4. Redeploy the site

## Features

### 📦 Products
- **Add Product:** Click "Add New Product" to create a new product
  - Name, price, description, PayHip link
  - Upload a product cover image
- **Edit Product:** Click "Edit" on any product card to modify it
- **Delete Product:** Click "Delete" to remove a product

### 📝 Blog
- **Write Post:** Click "Write New Post" to create blog content
  - Title, rich text content editor with formatting
  - Upload featured image
- **Rich Text Tools:** Bold, italic, underline, headings, lists, links
- **Delete Post:** Remove old posts when needed

### 🎬 Videos
- **Add Video:** Click "Add Video" to embed promotional content
  - Supports YouTube and Vimeo links
  - Paste full video URL (e.g., `https://youtube.com/watch?v=...`)
  - Add title and description
- **Delete Video:** Remove videos from your site

### 📁 Files
- **Upload Files:** Add product files, images, documents
  - Supports any file type
  - Files are stored securely
- **Delete Files:** Remove files from storage

## Security

- **Login Protection:** Admin panel requires password authentication
- **Session Tokens:** Login sessions are stored in your browser's local storage
- **Logout:** Always logout when finished to prevent unauthorized access
- **Password-Only Auth:** No username required, just a strong password

## File Storage

Uploaded files and images are stored in Netlify:
- Product images: `/uploads/products/`
- Blog images: `/uploads/blog/`
- General files: `/uploads/files/`
- Data files: `/data/`

## Data Storage

Site data is stored in JSON files:
- Products: `/data/products.json`
- Blog posts: `/data/blog.json`
- Videos: `/data/videos.json`
- Files manifest: `/data/files.json`

These files are generated automatically and not tracked in git to avoid conflicts.

## Troubleshooting

**Can't login?**
- Check that you're using the correct password
- After 5 failed attempts, you'll be locked out for 15 minutes
- Try again after waiting

**File upload not working?**
- Check file size (recommend under 10MB)
- Try a different file format
- Check browser console for error messages

**Products not showing?**
- Refresh the page
- Check that images are correct format (JPG, PNG, GIF, WebP)

## Best Practices

1. **Backup Content:** Save copies of important content before deleting
2. **Use Descriptions:** Write clear product descriptions for better conversions
3. **Optimized Images:** Use compressed images for faster loading
4. **PayHip Links:** Verify PayHip links are correct when adding products
5. **Regular Updates:** Update blog frequently for better SEO

## Support

For issues or feature requests, contact your developer or check the browser console for error messages.
