// ✅ This file is a JavaScript template used for injecting environment variables at runtime
//    The placeholder "$BACKEND_BASE_URL" will be replaced by the actual value during container startup
//    using the `entrypoint.sh` script and `envsubst`.

// This object becomes available globally in the browser as `window.env`
// so frontend code can then access `window.env.BACKEND_BASE_URL` dynamically.
window.env = {
    BACKEND_BASE_URL: "$BACKEND_BASE_URL"
  };
  