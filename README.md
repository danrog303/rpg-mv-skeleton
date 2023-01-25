# rpg-mv-skeleton
[![ci](https://github.com/danrog303/rpg-mv-skeleton/actions/workflows/ci.yml/badge.svg)](https://github.com/danrog303/rpg-mv-skeleton/actions/workflows/ci.yml)
![Last updated](https://img.shields.io/github/last-commit/danrog303/rpg-mv-skeleton)
![License - Unlicense](https://img.shields.io/badge/license-Unlicense-blue)
> Template repository for versioning RPG Maker MV/MZ games with automatic release building.

# Why was this project created?
Some time ago I started working on a game in RPG Maker. I wanted to store the game on my private GitHub and found out that there is 
no automatic build system for RPG Maker. Since I didn't want to re-build the 
application using Cordova with every small update, I decided that I will automate this 
task.

This template repository can be used to store RPG Maker MV and RPG Maker MZ games. When tag is pushed, GitHub will
create Android APK and Windows ZIP, and then new GitHub release will be created.

# How to use?
Simply  click the "Use this template" button and create a new GitHub repository.
![image](https://user-images.githubusercontent.com/32397526/214673856-0eca9cf6-0ee0-4e44-aabb-4b9d14f49bda.png)
After creating the repository, delete example game from "game/" directory and put your own game here.
You can put a game project from RPG Maker MV or RPG Maker MZ - either will work.

Then, if you want your game to be compiled, simply push a new tag to GitHub. 
The GitHub Actions workflow attached to this repository will detect the tag push and will automatically create 
a new GitHub release with the Windows and Android release of the game.

# How to build my game?
If you want to build the game yourself, without relying on GitHub Actions, follow the steps below.  

The preferred way to use the build tools is to use Docker. If you don't want to use Docker, you will need to install the Cordova tool along with the required Android libraries.

To build Windows or Android release, use:
```shell
$ docker build -t skelimage .
$ docker run -it -v "SOME_DIR:/opt/rpgmvskel"
$ npm run build:windows && npm run build:android
```