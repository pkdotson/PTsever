import React from 'react';

let List = ({ items, onClick, title }) => {
  let itemList = items.map((e,i)=>{
    return ( 
      <div className="row list-group-item" key={i} data-videoid={e.videoId} onClick={onClick}>
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
      <h4> { title } </h4>
      <div className="suggestions list-group">
        {itemList}
      </div>
    </div>
  )
}

export default List;
