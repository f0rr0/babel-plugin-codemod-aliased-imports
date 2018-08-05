import { declare } from "@babel/helper-plugin-utils";
import path from "path";

export default declare((api, options, dirname) => {
  const { alias, path: relativeAliasedPath } = options;
  if (typeof alias !== "string") {
    throw new Error(
      `babel-plugin-codemod-aliased-imports expected an \`alias\` option of type string. Received ${alias} instead.`
    );
  }
  if (typeof relativeAliasedPath !== "string") {
    throw new Error(
      `babel-plugin-codemod-aliased-imports expected an \`path\` option of type string. Received ${relativeAliasedPath} instead.`
    );
  }
  return {
    name: "codemod-aliased-imports",
    visitor: {
      ImportDeclaration(node, state) {
        const importPath = node.get("source").node.value;
        const fileDirname = path.dirname(state.filename);
        const absoluteImportPath = path.resolve(fileDirname, importPath);
        const absoluteAliasedPath = path.resolve(dirname, relativeAliasedPath);
        if (
          !node.aliased &&
          absoluteImportPath.startsWith(absoluteAliasedPath)
        ) {
          node.aliased = true;
          node.replaceWith(
            api.types.importDeclaration(
              node.get("specifiers"),
              api.types.stringLiteral(
                absoluteImportPath.replace(absoluteAliasedPath, alias)
              )
            )
          );
        }
      }
    }
  };
});
