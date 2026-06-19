const youtubedl = require('youtube-dl-exec');
youtubedl('https://www.instagram.com/reel/DC_h0H7q_Zk/', {
  dumpJson: true,
  noCheckCertificates: true,
  noWarnings: true
}).then(output => {
  console.log('Title:', output.title);
  output.formats.forEach(f => {
    console.log(`${f.format_id}: res=${f.resolution}, ext=${f.ext}, acodec=${f.acodec}, vcodec=${f.vcodec}`);
  });
}).catch(err => {
  console.error('Error:', err.message);
});
