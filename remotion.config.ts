import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
// Required for @remotion/effects (lightLeak() etc.), which render via WebGL2.
Config.setChromiumOpenGlRenderer("angle");
