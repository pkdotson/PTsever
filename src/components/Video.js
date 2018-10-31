import React from 'react';

let Video = ({ currentVideo, comments}) =>{
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
          src={`//www.youtube.com/embed/${currentVideo ? currentVideo.videoId : ''}`}
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

export default Video;
