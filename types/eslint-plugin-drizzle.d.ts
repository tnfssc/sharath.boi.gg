declare module "eslint-plugin-drizzle" {
  const plugin: {
    configs: {
      recommended: import("eslint").Linter.Config;
    };
    rules: import("eslint").Linter.RulesRecord;
  } & import("eslint").ESLint.Plugin;
  export default plugin;
}
