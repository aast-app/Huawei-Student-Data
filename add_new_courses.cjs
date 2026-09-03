const fs = require('fs');
const file = 'c:/Users/laten/Desktop/Huawei Student Data/src/data/courses.js';
let content = fs.readFileSync(file, 'utf8');

// Update imports
if (!content.includes('Zap')) {
  content = content.replace("} from 'lucide-react';", ", Zap, Wifi, Activity } from 'lucide-react';");
}

const branches = [
  { name: 'AAST-PORTSAID', prefix: 'AASTMT-PORTSAID' }
];

for (const b of branches) {
  const safeName = b.name.replace(/[()]/g, '\\$&');
  const regex = new RegExp(`('${safeName}': \\[[\\s\\S]*?\\n)(  \\])`, 'm');
  
  const transmission = `    { shortName: 'Transmission', longName: 'Transmission_Course_${b.prefix}', code: 'TBA', icon: Activity, color: 'text-pink-600', bg: 'bg-pink-50', url: '' },`;
  const digitalPower = `    { shortName: 'Digital Power', longName: 'Digital Power_Course_${b.prefix}', code: 'TBA', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', url: '' },`;
  const wireless = `    { shortName: 'Wireless Domain', longName: 'Wireless Domain_Course_${b.prefix}', code: 'TBA', icon: Wifi, color: 'text-teal-600', bg: 'bg-teal-50', url: '' },`;
  const computing = `    { shortName: 'Computing', longName: 'Computing_Course_${b.prefix}', code: 'TBA', icon: Monitor, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', url: '' },`;
  
  content = content.replace(regex, `$1${computing}\n${transmission}\n${digitalPower}\n${wireless}\n$2`);
}

fs.writeFileSync(file, content);
console.log('Added 3 courses to all branches!');
