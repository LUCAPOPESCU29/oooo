import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aframecabins.app',
  appName: 'A-Frame Cabins',
  webDir: 'public',
  server: {
    // Point to your deployed website (update this URL when you deploy)
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;
