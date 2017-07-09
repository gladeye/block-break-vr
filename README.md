# block-break-vr
A multiplayer WebVR game where each side builds and defends their stronghold from the opposing team.

[View Demo](https://gladeye.github.io/block-break-vr/) (Single-player only)

Aim the cursor and click to place a block, jump and shoot your way to victory! Build and defend your fort while trying
to destroy the opposing teams relic.

## Controls

*   Spacebar - Jump
*   CTRL - Shoot

## Installation

*   Run the following from the project root:

```bash
npm install
```

## Developers

### Notes

*   After pulling from the repository whe a new package has been added, be sure to run `npm install` or
    the `_build/index.js.map` won't compile correctly. Check inside that file for errors.

### Development Mode

*   Run the following to start the development server:

    ```
    npm start
    ```

    Open your browser to http://localhost:8080 to view the project.

### Production Mode

*   Run the following to start the server in production mode so you can access the server via your IP address

    ```
    npm run prod
    ```
    Open your browser to http://YOUR_IP:8080 to view the project.