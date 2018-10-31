/*global gapi*/
import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import {Grid, Row, Col } from 'react-bootstrap';
import queryString from 'query-string';

const APIKEY = "AIzaSyC9Aaj7gMAxavk_W-lIlc4awpgfILeWGqA";

let VideoComponent = ({ currentVideo, comments}) =>{
    let commentArr = comments.map((e,i)=> {
      return (
        <div key={i}>
          <p className="commentName">{e.name}</p>
          <p>{e.comment}</p>
          <p className="likes"> Likes: {e.likes}</p>
        </div>
      );
    });

    return (
      <div className="currentVideo">
        <iframe
          width="100%" height="400px"
          src={`//www.youtube.com/embed/${currentVideo ? currentVideo.id : ''}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen></iframe>
        <br />
        <hr />
        <h3>{currentVideo.title}</h3>
        <div className="cover">
        <p>{currentVideo.description}</p>
        </div>
        <p>Like: {currentVideo.likes}</p><p>Dislike: {currentVideo.dislikes}</p> 
        <hr />
        <h4> Top comments: </h4>
            {commentArr}    
      </div>
   );
}

let ArrVids = ({items, onClick}) => {
  let itemList = items.map((e,i)=>{
    return ( 
      <div className="row list-group-item" key={i} data-videoid={e.id} onClick={onClick}>
       <div className="col-md-5">
        <img src={e.poster} alt="" />
       </div>
       <div className="col-md-7">
        <span className="title" >{e.title}</span>
       </div>
      </div>
    )
  });
  return(
    <div>
      <h4> Recommended Vids </h4>
      <div className="suggestions list-group">
        {itemList}
      </div>
    </div>
  )
}


let RecVids = ({items, onClick}) => {
  let itemsList = items.map((e,i)=>{
    return(
      <div className="suggestion row" key={i} data-videoid={e.videoId} onClick={onClick} >
        <div className="col-md-5">
          <img src={e.poster} alt="" />
        </div>
        <div className="col-md-7">
          <span className="title" >{e.title}</span>
        </div>
      </div>
    );
  });
  return(
    <div>
    <hr />
    <br />
    <h4> Recent Vids </h4>
     <div className="suggestions">
      {itemsList}
     </div>
    </div>
  )
}

class Search extends Component {
  constructor() {
    super();
    this.state={
      value: ''
    }
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value
    }) 
  }
  
  onSubmit = () => {
    this.props.onSearch(this.state.value);
  }

  render() {
    return (
    <div className="input-group App">
      <input type="text" className="form-control" value={this.state.value} placeholder="Search" onChange={ this.onChange }/>
      <span className="input-group-btn">
        <button className="btn btn-default" type="button" onClick={this.onSubmit}>Go!</button>
      </span>
    </div> 
    );
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      watchedVids: [],
      src:"",
      poster:"",
      currentVideo: {},
      comments: []
    };
  }

  componentDidMount () {
    this.loadYoutubeApi();
    this.getWatchVids();
  }
  // helper functions 
  //
  loadYoutubeApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(APIKEY);
        gapi.client.load('youtube', 'v3', this.setupPage ) 
      });
    };

    document.body.appendChild(script);
  }

  getWatchVids = () => {
   axios.get('/videos')
    .then((r)=>{
      this.setState({
        watchedVids:  r.data.videos 
      });
    });
  }
  setupPage = () => {
    this.search().then((data)=>{
      this.setSuggestions(data);
      this.fetchVideo(
        data.result.items[0].id.videoId
      ).then((current)=>{
        this.setCurrent(current);
        this.fetchComments(current.result.items[0].id)
          .then((data) =>{
            this.setComments(data);
          })
      })
    });
  }
  
  handleVideoClick = (videoId) => {
    return this.fetchVideo(
      videoId
    ).then((current)=>{
      this.setCurrent(current);
      this.fetchComments(current.result.items[0].id)
        .then((data) =>{
          this.setComments(data);
        })
      return current;
    });
  }

  handleRecVideoClick = (e) => {
    const videoId = e.currentTarget.dataset.videoid;
    this.handleVideoClick(videoId);
  }

  handleArrVideoClick = (e) => {
    const videoId = e.currentTarget.dataset.videoid;
    this.handleVideoClick(videoId)
      .then((current)=>{
        this.updateVidList(current);
      })
  }

  updateVidList = (current) => {
    axios.post('/video', 
      queryString.stringify({
        videoId: current.result.items[0].id,
        title:  current.result.items[0].snippet.channelTitle,
        poster: current.result.items[0].snippet.thumbnails.default.url
      })
    ).then((res)=>{
      const watchedVids = this.state.watchedVids;
      watchedVids.unshift(res.data.video);
      this.setState({ watchedVids });
    });
  }
  setComments = (data) => {
     let newArr = [];
     let comments = data.result.items.forEach(item=>{
     let snippet = item.snippet.topLevelComment.snippet;
      newArr.push({
        name: snippet.authorDisplayName, 
        comment: snippet.textDisplay,
        likes: snippet.likeCount
      });
    })
    this.setState({
      comments: newArr 
    });
  }
  setCurrent = (data)=>{
    const r = data.result.items[0];
    this.setState({
      currentVideo: {
        id: r.id,
        title: r.snippet.title,
        description: r.snippet.description,
        likes: r.statistics.likeCount,
        dislikes: r.statistics.dislikeCount
      }
    })
  }
  setSuggestions = (data) => {
      let newArr = [];
      data.result.items.forEach(e=>
        newArr.push({
          id: e.id.videoId,
          title: e.snippet.title,
          poster:e.snippet.thumbnails.default.url,
          description: e.snippet.description
        })
      );
     this.setState({suggestions: newArr });
  }


  fetchResult =(searchString)=>{
    this.search(searchString).then((data)=>{
      this.setSuggestions(data);
    })
  }

  // GOOGLE API
  fetchVideo = (id) => {
    return gapi.client.youtube.videos.list({
      id,
      part: 'snippet,contentDetails,statistics,player'
    })
  }

  search(word) {
    return gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent(word).replace(/%20/g, "+"),
      maxResults: 10,
      order: "viewCount",
    });
  }

  fetchComments = (id) => {
    return gapi.client.youtube.commentThreads.list({
      part: "snippet,replies",
      videoId: id
    });
  }

  render() {
    return (
      <Grid >
        <Row>
          <Col md={4}>
            <h4 className="App">philltube</h4>
          </Col>
          <Col md={8}>
            <Search onSearch={ this.fetchResult }/>
          </Col>
        </Row>
        <Row>
          <Col md={8} >
            <VideoComponent comments={this.state.comments} currentVideo={this.state.currentVideo} />
          </Col>
          <Col md={4} >
            <Row>
              <ArrVids  items={this.state.suggestions} onClick={this.handleArrVideoClick}  />
            </Row>
            <Row>
              <RecVids  items={this.state.watchedVids} onClick={this.handleRecVideoClick} />
            </Row>
          </Col>
        </Row>  
      </Grid>
    );
  }
}



export default App;

