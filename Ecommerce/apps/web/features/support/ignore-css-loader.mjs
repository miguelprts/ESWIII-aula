export async function load(url, context, nextLoad) {
  if (new URL(url).pathname.endsWith(".css")) {
    return {
      format: "module",
      shortCircuit: true,
      source: "export default {};",
    };
  }

  return nextLoad(url, context);
}
