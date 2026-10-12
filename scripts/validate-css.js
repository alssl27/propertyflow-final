import { readFile } from "node:fs/promises";
import * as csstree from "css-tree";
const css = await readFile("assets/css/styles.css", "utf8");
const errors = [];
const ast = csstree.parse(css, {
  positions: true,
  onParseError: (error) => errors.push(error.message),
});
csstree.walk(ast, {
  visit: "Declaration",
  enter(node) {
    if (node.property.startsWith("--")) return;
    const result = csstree.lexer.matchProperty(node.property, node.value);
    // Values containing CSS variables cannot be resolved statically; the browser checks them.
    if (result.error && !result.error.message.includes("var("))
      errors.push(`Line ${node.loc.start.line}: ${result.error.message}`);
  },
});
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "CSS Tree: syntax and supported property/value grammar passed; custom properties need browser verification.",
  );
