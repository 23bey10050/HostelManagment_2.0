const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;
walkDir('s:/Coding/Hostel Mangment_2.0/frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    // Replace auth.currentUser.getIdToken() with localStorage
    content = content.replace(/await auth\.currentUser(?:\?)?\.getIdToken\(\)/g, "localStorage.getItem('demo_token')");
    
    // Some places might not have await
    content = content.replace(/auth\.currentUser(?:\?)?\.getIdToken\(\)/g, "localStorage.getItem('demo_token')");
    
    // Also remove import { auth } from ...firebase
    content = content.replace(/import \{ auth \} from ['"].*?firebase['"];?\n?/g, '');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Modified:', filePath);
      modifiedCount++;
    }
  }
});
console.log('Total files modified:', modifiedCount);
