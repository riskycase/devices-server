#/bin/bash

if [[ -z $DATABASE_URL ]]; then
    echo "Database URL not set for container!"
    exit 1;
fi

npx prisma db push --skip-generate

HOSTNAME="0.0.0.0" node server.js
