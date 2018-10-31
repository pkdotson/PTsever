import express from "express";
import path from "path";
import bodyParser from 'body-parser'
import React from "react";
import { renderToString } from "react-dom/server";
import App from './App';
import htmlTemplate from './template'; 
import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

const app = express();
const mgURL = process.env.MONGODB_URI || 'mongodb://localhost/video';
const PORT = process.env.PORT || 2048 

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use( express.static( path.resolve( __dirname, "../dist" ) ) );


const Schema = mongoose.Schema;
const videoSchema = Schema({
  videoId: String ,
  title:  String ,
  poster:  String ,
  date: { type: Date, default: Date.now }
});
const Video = mongoose.model('video', videoSchema);


// GET: get top 10 recently viewed videos
app.get("/videos", (req, res) => {
  mongoose.connect(mgURL, function() {
    Video.find().sort('-date').limit(10).exec(function(err, videos){
      res.json({videos})
      });
  });
});


// POST: save recently viewed video
app.post("/video", (req, res) => {
  const video = {
    videoId: req.body.videoId,
    title: req.body.title,
    poster: req.body.poster
  }
  mongoose.connect(mgURL, function() {
    Video.create(video, function(err) {
      if (err) res.status(500);
      res.json({ video })
    });
  });
});


// Home page
app.get( "/", ( req, res ) => {
  const jsx = (<App />);
  const reactDom = renderToString( jsx );
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end( htmlTemplate( reactDom ) );
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


