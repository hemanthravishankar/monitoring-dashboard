# This shell script runs at container start and injects environment variables

#!/bin/sh

# ✅ Replace placeholder variable ($BACKEND_BASE_URL) in env.template.js 
#    and generate env.js with actual value, accessible to frontend JavaScript
envsubst '${BACKEND_BASE_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# ✅ Replace placeholder in nginx config template with actual backend base URL
#    This enables Nginx reverse proxy to point to the correct backend service
envsubst '${BACKEND_BASE_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# ✅ Start the Nginx server in foreground mode (as PID 1 in container)
nginx -g 'daemon off;'
