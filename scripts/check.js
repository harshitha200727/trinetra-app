/* Quick sanity check: every script listed in index.html exists and parses. Run with: npm run check */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const files = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
let bad = 0;
files.forEach(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { console.error("MISSING ", f); bad++; return; }
  try { new vm.Script(fs.readFileSync(p, "utf8"), { filename: f }); console.log("ok      ", f); }
  catch (e) { console.error("SYNTAX  ", f, e.message); bad++; }
});
console.log(bad ? bad + " problem(s)" : files.length + " files OK");
process.exit(bad ? 1 : 0);
