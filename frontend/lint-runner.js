const { ESLint } = require("eslint");
(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["components/ui/chart.tsx"]);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = await formatter.format(results);
  console.log(resultText);
})().catch(console.error);
