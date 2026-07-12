import { Config } from 'remotion';

Config.setCodec('h264');
Config.setCrf(28);
Config.setFps(30);

Config.setFrameRange([0, -1]); // Render full duration

// For preview server
Config.setImageFormat('png');

// Use system Chromium if available
Config.setChromiumExecutablePath('/opt/pw-browsers/chromium');

export default undefined;
