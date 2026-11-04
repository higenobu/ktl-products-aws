# Include inside the existing llm-jp.com HTTPS VirtualHost.
# Place before any catch-all ProxyPass.
RedirectMatch 302 "^/products$" "/products/"
ProxyPass "/products/" "http://127.0.0.1:8011/products/" connectiontimeout=5 timeout=30
ProxyPassReverse "/products/" "http://127.0.0.1:8011/products/"

<Location "/products/api/applications/">
    LimitRequestBody 8192
</Location>
