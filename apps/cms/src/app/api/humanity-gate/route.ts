import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), "humanity-gate.json");

interface HumanityGateConfig {
  isEnabled: boolean;
}

async function readConfig(): Promise<HumanityGateConfig> {
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If file doesn't exist, create default config
    console.error("[readConfig] Error reading config:", error);
    const defaultConfig: HumanityGateConfig = { isEnabled: false };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}

async function writeConfig(config: HumanityGateConfig): Promise<void> {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function GET() {
  const config = await readConfig();
  return NextResponse.json({ isEnabled: config.isEnabled });
}

export async function POST() {
  const config = await readConfig();
  const newConfig: HumanityGateConfig = {
    isEnabled: !config.isEnabled,
  };
  await writeConfig(newConfig);
  return NextResponse.json({ isEnabled: newConfig.isEnabled });
}
