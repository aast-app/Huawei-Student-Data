const fs = require('fs');
const file = 'c:/Users/laten/Desktop/Huawei Student Data/src/data/courses.js';
let content = fs.readFileSync(file, 'utf8');

const branches = [
  { name: 'AASTMT-Miami', long: 'Computing_Course_AASTMT-Miami' },
  { name: 'AASTMT-Dokki', long: 'Computing_Course_AAST-IECDokki' },
  { name: 'AASTMT-Fouad', long: 'Computing_Course_AAST-IECFouad' },
  { name: 'AASTMT-Alamein', long: 'Computing by AASTMT-Alamein' },
  { name: 'AASTMT-Smart Village', long: 'Computing_Course_AASTMT-SV' },
  { name: 'AASTMT-Aswan', long: 'Computing_Course_AASTMT-Aswan' },
  { name: 'AASTMT-ENG (Sheraton)', long: 'Computing_COURSE_AASTMT-ENG' },
  { name: 'AAST-PORTSAID', long: 'Computing-Course-AASTMT-PORTSAID' }
];

for (const b of branches) {
  const safeName = b.name.replace(/[()]/g, '\\$&');
  const regex = new RegExp(`('${safeName}': \\[[\\s\\S]*?\\n)(  \\],)`, 'm');
  content = content.replace(regex, `$1    { shortName: 'Computing', longName: '${b.long}', code: 'TBA', icon: Monitor, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', url: '' },\n$2`);
}

fs.writeFileSync(file, content);
console.log('Done!');
