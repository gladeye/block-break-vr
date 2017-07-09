# Block Break VR

A multiplayer WebVR game where each side builds and defends their stronghold from the opposing team.

[View Demo](https://gladeye.github.io/block-break-vr/) (Single-player only)

## Objective

Aim the cursor and click to place a block, jump and shoot your way to victory! Build and defend your fort while trying
to destroy the opposing teams shiny relic.

## Controls

*   Spacebar - Jump
*   CTRL - Shoot

## Known Issues

*   Blocks can only be placed on / destroyed from the top and 2 of the facing sides.
*   Sounds events do not sync over the network
*   Network activity can be laggy when firing projectiles
*   Current demo is single-player only

## TODO

*   Add jump sound effects
*   Add block destruction animation
*   Sync sound events over network
*   Trigger local physics for animations in response to network events (e.g. block destruction)
*   Provision multiplayer demo server
*   Add scoring and rounds
*   Add team colours
*   Add new player model
*   Test block placing using HTC Vive / Oculus controllers
*   Add locomotion support for Google Cardboard / Mobile devices
*   Add support for block placing using GearVR / Daydream controllers

## Credits

*   Sound effects: [timgormly](https://freesound.org/people/timgormly/), [onikage22](https://freesound.org/people/onikage22/), [MusicLegends](https://freesound.org/people/musiclegends/)
*   Music: [Stray Fibers](https://www.guyannan.com/music/)
*   Lead Programmer: [Michael Andrew](https://www.uxvirtual.com)
*   Programmers: [Ben Sharp](https://github.com/ben-sharp)
*   3D Modelling: Manuel Hernandez

Also a special thanks to everyone from the [A-Frame](https://www.aframe.io) community who contributed components to this project!

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