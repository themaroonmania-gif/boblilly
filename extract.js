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
console.log('Images:', [...new Set(imgs)]);

const pRegex = /<p[^>]*>(.*?)<\/p>/gs;
let ps = [];
while ((match = pRegex.exec(html)) !== null) {
  const text = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text.length > 50) ps.push(text);
}
console.log('\nText Content:');
ps.forEach(p => console.log('- ' + p));

// Also let's extract h1, h2, h3
const hRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gs;
let hs = [];
while ((match = hRegex.exec(html)) !== null) {
  const text = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text.length > 10) hs.push(text);
}
console.log('\nHeadings:');
hs.forEach(h => console.log('- ' + h));
