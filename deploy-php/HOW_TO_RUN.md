# How to Run PHP Server (Development)

To run the backend properly with API routing enabled, use the following command inside this directory:

```powershell
php -S localhost:3000 index.php
```

**Note:**
- You must be inside the `deploy-php` folder.
- The `index.php` at the end is crucial because it acts as the router for all API requests. Without it, you will see 404 errors.
