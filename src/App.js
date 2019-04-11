import React, { Component } from 'react';
import SingleImgView from '../src/ImageViewer/index.js'

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
      this.setState({ showViewer: false})
  }
  render() {
    const { showViewer, current } = this.state;
    let imagelist = [
            'https://zmage.caldis.me/imgSet/childsDream/1.jpg',
            'https://zmage.caldis.me/imgSet/childsDream/2.jpg',
            'https://zmage.caldis.me/imgSet/childsDream/3.jpg'
        ];
    return (
      <div>
          <ul className="gallery">
            { imagelist.map((item, i)=>{
                return (<li key={i}><img className="pic" src={item} onClick={this.show.bind(this, i)} alt="" /></li>)
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
