import type { MaintenanceConfig } from "@/types";

const STORAGE_KEY = "weddingkit_maintenance_config";

export function isPathUnderMaintenance(pathname: string, maintainedPaths: string[]): boolean {
  for (const mp of maintainedPaths) {
    if (mp.endsWith("/*")) {
      const prefix = mp.slice(0, -1);
      if (pathname.startsWith(prefix) && pathname.length > prefix.length) {
        return true;
      }
    } else {
      if (pathname === mp) {
        return true;
      }
    }
  }
  return false;
}

export function loadMaintenanceConfig(): MaintenanceConfig {
  if (typeof window === "undefined") {
    return { paths: [], message: "" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as MaintenanceConfig;
    }
  } catch {
    // ignore
  }
  return { paths: [], message: "" };
}

export function saveMaintenanceConfig(config: MaintenanceConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
