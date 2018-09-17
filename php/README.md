# API
<p>It is in charge of generating QR code, receiving uploade image (base64 encoded) and send some message to node by using PUB/SUB channek fron redis</p>

## Deps
Install Nging server
Install redis server and start it under the default ip:port settings
Install php-gd module

## Nginx Install (local usage)

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        
        root /sources/pix2desktop/php/public;
    
        server_name pix2desktop.backend.local;
    
        location / {
                try_files $uri /index.php$is_args$args;
        }
    
        location ~ ^/index\.php(/|$) {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }
    
        location ~ /\.ht {
            deny all;
        }
    
        location ~ \.php$ {
                return 404;
        }
    }

this will start nginx http server on port 80