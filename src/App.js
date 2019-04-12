import React, { Component } from 'react';
import SingleImgView from './components/index.js';
import FirstImg from './components/images/1.jpg';
import SecondImg from './components/images/2.jpg';
import ThirdImg from './components/images/3.jpg';

class App extends Component {
  state = {
    showViewer: false,
    current: 1
  }
  show(current) {
    this.setState({
      showViewer: true,
      current
    })
  }
  close() {
    this.setState({
      showViewer: false
    })
  }
  render() {
    const { showViewer, current } = this.state;
    let imagelist = [
      FirstImg,
      SecondImg,
      ThirdImg
    ];
    return (
      <div>
        <ul className="gallery">
          {imagelist.map((item, i)=>{
            return (
              <li key={i}>
                <img
                  className="pic"
                  src={item}
                  onClick={this.show.bind(this, i)}
                  alt=""
                />
              </li>
            )
          })}
        </ul>  
        {
          !!showViewer && <SingleImgView current={current} imagelist={imagelist} close={this.close.bind(this)} />
        }
      </div>
    );
  }
}

export default App;
