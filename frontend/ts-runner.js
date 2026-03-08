const ts = require("typescript");
const files = process.argv.slice(2);
if (files.length === 0) files.push("components/ui/chart.tsx");
const program = ts.createProgram(files, {
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true
});
const emitResult = program.emit();
const allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

allDiagnostics.forEach(diagnostic => {
  if (diagnostic.file) {
    let { line, character } = ts.getLineAndCharacterOfPosition(
      diagnostic.file,
      diagnostic.start
    );
    let message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    console.log(`line ${line + 1}: ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  }
});
