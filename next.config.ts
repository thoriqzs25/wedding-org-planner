import type { NextConfig } from "next";
import { execSync } from "child_process";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const commitTime = execSync("git log -1 --format=%cd --date=format:'%d %b %Y, %H:%M'").toString().trim();

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
    NEXT_PUBLIC_COMMIT_TIME: commitTime,
  },
};

export default nextConfig;
