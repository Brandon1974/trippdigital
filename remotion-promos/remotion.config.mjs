import { Config } from 'remotion';

Config.setCodec('h264');
Config.setCrf(28);
Config.setFps(30);

Config.setFrameRange([0, -1]); // Render full duration

// For preview server
Config.setImageFormat('png');

export default undefined;
