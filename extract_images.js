const fs = require('fs');
const html = fs.readFileSync('C:/Users/ThomasHarden/.gemini/antigravity-cli/brain/18ad0d65-03b9-43c7-9d5d-68beeda28e4d/.system_generated/steps/30/content.md', 'utf8');

const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
let imgs = [];
let match;
while ((match = imgRegex.exec(html)) !== null) {
  if (match[1].startsWith('http') && !match[1].includes('.svg') && !match[1].includes('data:image')) {
    imgs.push(match[1]);
  }
}
[...new Set(imgs)].forEach(img => console.log(img));
