
const APIKEY = "AIzaSyC9Aaj7gMAxavk_W-lIlc4awpgfILeWGqA";

export function loadYoutubeApi(cb) {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/client.js";
  script.onload = () => {
    gapi.load('client', () => {
      gapi.client.setApiKey(APIKEY);
      gapi.client.load('youtube', 'v3', cb);
    });
  };
  document.body.appendChild(script);
}

export function fetchVideo(id) {
  return gapi.client.youtube.videos.list({
    id,
    part: 'snippet,contentDetails,statistics,player'
  });
}

export function fetchComments(id) {
  return gapi.client.youtube.commentThreads.list({
    part: "snippet,replies",
    videoId: id
  });
}

export function search(word) {
  return gapi.client.youtube.search.list({
    part: "snippet",
    type: "video",
    q: encodeURIComponent(word).replace(/%20/g, "+"),
    maxResults: 10,
    order: "viewCount",
  });
}
