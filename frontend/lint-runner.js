const { ESLint } = require("eslint");
(async function main() {
  const eslint = new ESLint();
  const files = process.argv.slice(2);
  if (files.length === 0) files.push("components/ui/chart.tsx");
  const results = await eslint.lintFiles(files);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = await formatter.format(results);
  console.log(resultText);
})().catch(console.error);
