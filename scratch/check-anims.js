const fs = require('fs');

function extractGLTF(path) {
  const buffer = fs.readFileSync(path);
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546c67) { console.error("Not a GLB"); return; }
  const jsonChunkLen = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);
  if (jsonChunkType !== 0x4e4f534a) { console.error("No JSON chunk"); return; }
  const jsonStr = buffer.toString('utf8', 20, 20 + jsonChunkLen);
  const json = JSON.parse(jsonStr);
  const animNames = (json.animations || []).map(a => a.name);
  console.log("Animations:", animNames);
}

extractGLTF('public/models/emilian-avatar.glb');
