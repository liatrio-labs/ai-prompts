import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export function classifyFile(file) {
  const lower = file.toLowerCase();
  const ext = lower.split(".").pop() || "";

  if (/(test|spec)\.(ts|tsx|js|jsx)$/.test(lower) || /(^|\/)(__tests__|tests?)\//.test(lower)) {
    return "tests";
  }

  // A file that maps to an inferable page route is visual even when it is a
  // plain .ts/.js page, keeping classification consistent with inferRoutes().
  if (inferRouteFromFile(file)) {
    return "visual";
  }

  if (/(^|\/)(src|app|pages|components|features|routes|views)\//.test(lower)) {
    if (["tsx", "jsx", "vue", "svelte", "css", "scss", "sass", "less"].includes(ext)) {
      return "visual";
    }
  }

  if (["tsx", "jsx", "vue", "svelte", "css", "scss", "sass", "less"].includes(ext)) {
    return "visual";
  }

  if (["md", "mdx", "txt"].includes(ext)) {
    return "docs";
  }

  // Match whole path segments/words (bounded by / . _ -) so tokens like `route`
  // do not match inside unrelated names such as `routing`/`router`. `route` is
  // intentionally omitted because a `routes/` directory is a UI routing root.
  if (/(^|[/._-])(api|server|service|services|controller|controllers|schema|schemas|model|models|migration|migrations|alembic|database|db|repository|repositories|dao)([/._-]|$)/.test(lower)) {
    return "backend";
  }

  if (["json", "yaml", "yml", "toml", "lock"].includes(ext)) {
    return "config";
  }

  return "other";
}

export function likelySurface(file) {
  const parts = file.split("/");
  const markers = ["pages", "routes", "features", "components", "views", "app"];
  const markerIndex = parts.findIndex((part) => markers.includes(part));
  if (markerIndex >= 0 && parts[markerIndex + 1]) return parts[markerIndex + 1];
  return parts.at(-1);
}

const ROUTE_ROOTS = ["app", "pages", "routes"];
const ROUTE_EXTENSIONS = ["tsx", "jsx", "ts", "js", "vue", "svelte"];
// Filenames that represent the route itself (its URL comes from the directory path).
const INDEX_BASENAMES = new Set(["index", "page", "+page", "_index"]);
// Framework files that are not addressable reviewer-facing pages on their own.
// `route` is a Next.js App Router API handler (route.ts), not a UI page.
const NON_PAGE_BASENAMES = new Set([
  "layout", "+layout", "+server", "loading", "error", "+error", "not-found",
  "template", "default", "_app", "_document", "head", "middleware", "route",
]);

function inferRouteFromFile(file) {
  const parts = String(file).replace(/\\/g, "/").split("/").filter(Boolean);
  let rootIndex = -1;
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (ROUTE_ROOTS.includes(parts[i])) {
      rootIndex = i;
      break;
    }
  }
  if (rootIndex === -1) return null;

  const fileName = parts.at(-1);
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  if (!ROUTE_EXTENSIONS.includes(ext)) return null;

  const dirSegments = parts.slice(rootIndex + 1, -1);
  const base = fileName.replace(/\.(tsx|jsx|ts|js|vue|svelte)$/i, "");
  // Strip framework suffixes like `.server`/`.client` from SvelteKit/Remix names.
  const baseHead = base.replace(/\.(server|client)$/i, "");
  if (NON_PAGE_BASENAMES.has(baseHead)) return null;
  // Only SvelteKit `+page` is an addressable page; `+server`, `+layout`, etc. are not.
  if (baseHead.startsWith("+") && baseHead !== "+page") return null;

  let fileSegments;
  if (INDEX_BASENAMES.has(baseHead)) {
    fileSegments = []; // index/page files inherit their directory path
  } else if (baseHead.includes(".")) {
    // Remix flat routes: posts.$postId -> posts/:postId
    fileSegments = baseHead.split(".").filter((seg) => seg && seg !== "_index");
  } else {
    fileSegments = [baseHead];
  }

  let dynamic = false;
  const segments = [...dirSegments, ...fileSegments]
    // ignore route groups `(group)` and parallel-route slots `@slot`, which
    // are organizational folders that do not appear in the browser URL.
    .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")) && !seg.startsWith("@"))
    .map((seg) => {
      if (/^\[.*\]$/.test(seg) || seg.startsWith("$") || seg.startsWith(":")) {
        dynamic = true;
        const name = seg.replace(/^\[\.\.\./, "").replace(/^\[|\]$/g, "").replace(/^[$:]/, "") || "param";
        return `:${name}`;
      }
      return seg;
    })
    .filter(Boolean);

  // Files under an `api/` segment (Next.js Pages Router pages/api, etc.) are
  // JSON/handler endpoints, not reviewer-facing UI; never infer them as routes.
  if (segments[0] === "api") return null;

  const route = segments.length ? `/${segments.join("/")}` : "/";
  let confidence = "high";
  if (dynamic) confidence = "low";
  else if (fileSegments.length > 0) confidence = "medium";
  return { route, confidence, dynamic };
}

// Infer candidate URLs from changed files under file-based-routing directories
// (Next.js app/pages, Remix/React Router routes, SvelteKit, Nuxt/Vue pages).
// Deliberately conservative: files that are not clearly addressable pages yield
// no route, and dynamic routes are flagged so callers do not visit `:param` URLs.
export function inferRoutes(visualFiles = []) {
  const byRoute = new Map();
  for (const item of visualFiles) {
    const file = typeof item === "string" ? item : item?.file;
    if (!file) continue;
    const inferred = inferRouteFromFile(file);
    if (!inferred) continue;
    const existing = byRoute.get(inferred.route);
    if (existing) {
      existing.sources.push(file);
    } else {
      byRoute.set(inferred.route, { ...inferred, sources: [file] });
    }
  }
  return [...byRoute.values()].sort((a, b) => a.route.localeCompare(b.route));
}

async function git(args, cwd) {
  const { stdout } = await execFileAsync("git", args, { cwd, encoding: "utf8" });
  return stdout.trim();
}

async function diffNames(targetBranch, cwd) {
  try {
    return await git(["diff", "--name-only", `${targetBranch}...HEAD`], cwd);
  } catch {
    return git(["diff", "--name-only", `${targetBranch}..HEAD`], cwd);
  }
}

export async function analyzeBranch({ targetBranch = "main", cwd = process.cwd() } = {}) {
  const currentBranch = await git(["branch", "--show-current"], cwd).catch(() => "unknown");
  const rawFiles = await diffNames(targetBranch, cwd);
  const files = rawFiles.split("\n").map((file) => file.trim()).filter(Boolean);
  const classified = files.map((file) => ({
    file,
    category: classifyFile(file),
    surface: likelySurface(file),
  }));
  const categories = classified.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + 1;
    return result;
  }, {});
  const visualFiles = classified.filter((item) => item.category === "visual");
  const supportingFiles = classified.filter((item) => item.category !== "visual");
  const surfaces = [...new Set(visualFiles.map((item) => item.surface).filter(Boolean))];

  return {
    currentBranch,
    targetBranch,
    visualApplicable: visualFiles.length > 0,
    categories,
    visualSurfaces: surfaces,
    candidateRoutes: inferRoutes(visualFiles),
    files: classified,
    visualFiles,
    supportingFiles,
  };
}
