import React, { Component } from 'react';

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

export default Search;
