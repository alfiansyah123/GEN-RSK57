const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = `DATABASE_URL="mysql://root:@localhost:3306/gen_cok"
PORT=3000
`;

fs.writeFileSync(envPath, content, { encoding: 'utf8' });
console.log('.env file rewritten successfully');
