const ts = require("typescript");
const path = require("path");

const file = "components/ui/resizable.tsx";
const program = ts.createProgram([file], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  jsx: ts.JsxEmit.ReactJSX,
  esModuleInterop: true,
  skipLibCheck: false,
  strict: false,
  noEmit: true,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  paths: { "@/*": ["./*"] }
});

const all = ts.getPreEmitDiagnostics(program);
const relevant = all.filter(d => d.file && d.file.fileName.includes("resizable"));

if (relevant.length === 0) {
  console.log("No errors found in resizable.tsx!");
} else {
  relevant.forEach(d => {
    const pos = d.file.getLineAndCharacterOfPosition(d.start);
    console.log(`Line ${pos.line + 1}, Col ${pos.character + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
  });
}
