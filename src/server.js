import express from "express";
import path from "path";
import bodyParser from 'body-parser'

import React from "react";
import { renderToString } from "react-dom/server";
import App from './App';

import { MongoClient } from "mongodb";
import mongoose from 'mongoose';




/*History.create({
  id: "xefdsa",
  title: "bill test",
  poster: "www.google.com",
  date: Date.now
})*/  
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const Schema = mongoose.Schema;

console.log('Running mongoose version %s', mongoose.version);

/**
 * Console schema
 */

const videoSchema = Schema({
  videoId: String ,
  title:  String ,
  poster:  String ,
  date: { type: Date, default: Date.now }
});

const Video = mongoose.model('video', videoSchema);

// create record
/*mongoose.connect('mongodb://localhost/video', function(err) {
  if (err) throw err;
});*/


// get top 10 record




app.use( express.static( path.resolve( __dirname, "../dist" ) ) );

app.get("/videos", (req, res) => {
  console.log("-------------")
  mongoose.connect('mongodb://localhost/video', function(err) {
  Video.find().sort('-date').limit(10).exec(function(err, videos){
    console.log(videos)
    res.json({videos})
    });
  });
  console.log('-----');
});
console.log('----i hit outside----');

app.post("/video", (req, res) => {
  console.log("posting video ....");
  const video = {
    videoId: req.body.videoId,
    title: req.body.title,
    poster: req.body.poster
  }
  Video.create(video, function(err) {
    if (err) res.status(500);
    res.json({ video })
  });
});

app.get( "/", ( req, res ) => {

        const jsx = (
          <App />
        );
        const reactDom = renderToString( jsx );

        res.writeHead( 200, { "Content-Type": "text/html" } );
        res.end( htmlTemplate( reactDom ) );
} );

app.listen( 2048 );

function htmlTemplate( reactDom ) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script src="./app.bundle.js"></script>
        </body>
        </html>
    `;
}

