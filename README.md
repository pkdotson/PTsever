# React Server Side Rendering

This is a simple project to experiement with youtube api and react server side rendering.

To see demo: https://murmuring-beach-19954.herokuapp.com/ 

## Getting started

Install dependencies with
```npm install```

Run dev mode with
```npm run dev```


Test locally: `http://localhost:2048` 

### MongoDB

Video Schema

```
  {
    _id: primary ID, 
    videoId: String,    // video Id used to display video
    title: String, 
    poster: String      // thumbnail url
  }
```
### React Components
App:  root component that handles most of the state management and action calls

List:  creates a list of recomended videos from search and recently viewed history

Video: displays video and its comments when clicked

  


### Client.js

This part is the only part that's not server side rendering. It is the entry file for webpack to create bundle. 


### Server.js

Setup server and api

  GET /videos: return 10 top most recently viewed videos
  POST /videos: save a revently viewed video


### Index (SSR)

This is the entry file to start node server. This file loads the babel-register and sets up the babel plugins needed to run JSX and ESModules on the server.

```
node index.js
```

### Deployment 

This project deploys to heroku using mongodb addon





