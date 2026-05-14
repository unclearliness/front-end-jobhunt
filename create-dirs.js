const fs = require('fs');
const path = require('path');

const dirs = [
  'D:\\DoAnKHMT\\front-end-version2\\src\\app\\shared\\components\\company-search-banner',
  'D:\\DoAnKHMT\\front-end-version2\\src\\app\\shared\\components\\company-filter-sidebar',
  'D:\\DoAnKHMT\\front-end-version2\\src\\app\\pages\\explore-companies'
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created: ${dir}`);
});

console.log('All directories created successfully!');
