// Writes lists/prebuild-tw.txt: lists/prebuild.txt in Traditional characters, converted the way the page does it
// (OpenCC cn -> tw, with 台 kept over 臺), so the server can tell a Taiwan card is on the 5,000 list (v64).
// Run with opencc-js 1.4.2 installed: node scripts/build_prebuild_tw.js
const fs = require("fs"), OpenCC = require("opencc-js");
const t = OpenCC.Converter({ from: "cn", to: "tw" });
const lines = fs.readFileSync("lists/prebuild.txt", "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));
const out = ["# lists/prebuild.txt in Traditional characters (scripts/build_prebuild_tw.js); same order, same licenses.", ...lines.map(w => t(w).replace(/臺/g, "台"))];
fs.writeFileSync("lists/prebuild-tw.txt", out.join("\n") + "\n");
console.log(lines.length + " words");
