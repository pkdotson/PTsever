/*global gapi*/
import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import {Grid, Row, Col } from 'react-bootstrap';
import Search from './components/Search';
import Video from './components/Video';
import List from './components/List';
import {
  loadYoutubeApi,
  fetchVideo,
  fetchComments,
  search
} from './ga';

import queryString from 'query-string';

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
    loadYoutubeApi(this.setupPage);
    this.getWatchVids();
  }

  getWatchVids = () => {
   axios.get('/videos')
    .then((r)=>{
      this.setState({
        watchedVids:  r.data.videos 
      });
    });
  }

  updateVidList = (current) => {
    const {
      id,
      snippet: { channelTitle, thumbnails: { default: { url }}}
    } = current.result.items[0];
    axios.post('/video', 
      queryString.stringify({
        videoId: id,
        title:  channelTitle,
        poster: url
      })
    ).then((res)=>{
      const watchedVids = this.state.watchedVids;
      watchedVids.unshift(res.data.video);
      this.setState({ watchedVids });
    });
  }

  setupPage = () => {
    search().then((data)=>{
      this.setSuggestions(data);
      fetchVideo(
        data.result.items[0].id.videoId
      ).then((current)=>{
        this.setCurrentVideo(current);
        fetchComments(current.result.items[0].id)
          .then((data) =>{
            this.setComments(data);
          })
      })
    });
  }
 
  // event handlers
  handleVideoClick = (videoId) => {
    return fetchVideo(
      videoId
    ).then((current)=>{
      this.setCurrentVideo(current);
      fetchComments(current.result.items[0].id)
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
      });
  }

  // state mangement
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

  setCurrentVideo = (data)=>{
    const { 
      id,
      snippet: { title, description },
      statistics: { likeCount, dislikeCount }
    } = data.result.items[0];

    this.setState({
      currentVideo: {
        videoId: id,
        title,
        description,
        likes: likeCount,
        dislikes: dislikeCount
      }
    })
  }

  setSuggestions = (data) => {
      let newArr = [];
      data.result.items.forEach(e=>
        newArr.push({
          videoId: e.id.videoId,
          title: e.snippet.title,
          poster:e.snippet.thumbnails.default.url,
          description: e.snippet.description
        })
      );
     this.setState({ suggestions: newArr });
  }


  fetchResult =(searchString)=>{
    search(searchString).then(this.setSuggestions);
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
            <Video comments={this.state.comments} currentVideo={this.state.currentVideo} />
          </Col>
          <Col md={4} >
            <Row>
              <List 
                 title="Recommended Videos"
                 items={this.state.suggestions}
                 onClick={this.handleArrVideoClick}
              />
            </Row>
            <Row>
              <List
                title="Recently Viewed"
                items={this.state.watchedVids}
                onClick={this.handleRecVideoClick}
              />
            </Row>
          </Col>
        </Row>  
      </Grid>
    );
  }
}


export default App;

