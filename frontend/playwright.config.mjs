// CI uses the runner's preinstalled Chrome; local runs keep bundled Chromium.
export default {
  use: { channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
}
