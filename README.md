# Melody

Melody is an open-source music bot built with [NodeJS](https://nodejs.org/) and [TypeScript](https://www.typescriptlang.org/). It utilizes [Lavalink](https://github.com/lavalink-devs/Lavalink/) for audio streaming and [Sakulink](https://github.com/JirayuSrisawat-Github/sakulink) for handling YouTube links and other music-related functionalities.

## Features

- 🎶 Play music from various sources
- 🔊 Support for playlists
- 🎧 Real-time voice channel management
- 🎵 Easy integration with Discord.js and Sapphire
- 🌐 Open-source and actively maintained

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version LTS or higher)
- **Lavalink server** (refer to [Lavalink setup guide](https://github.com/lavalink-devs/Lavalink#setup))

## Installation

1. Clone the repository

  ```bash
  git clone https://github.com/JirayuSrisawat-Github/melody.git
  cd melody
  ```

2. Install dependencies

  ```bash
  npm install
  ```

3. Config by put your token in [config.ts](https://github.com/JirayuSrisawat-Github/melody/blob/main/src/config.ts)

  ```ts
  import { NodeOptions } from "sakulink";

  export const token: string = "xxx";
  export const defaultSearchPlatform: string = "youtube music";
  export const defaultVolume: number = 75; 
  export const nodes: NodeOptions[] = [
    {
      identifier: "Jirayu_V4",
      host: "lavalink.jirayu.net",
      port: 13592,
      password: "youshallnotpass",
    },
  ];
  ```

4. Build

  ```bash
  npm run build
  ```

5. Start your bot

  ```bash
  npm run start
  ```

## Usage

- Invite the bot to your server using the OAuth2 URL generated in the Discord Developer Portal.
- Use commands to play, pause, skip, and manage your music queue.

## Example Commands

- `/play query:<string>` - Play a song.
- `/stop` - Stop the music.
- `/skip` - Skip current song.

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.
