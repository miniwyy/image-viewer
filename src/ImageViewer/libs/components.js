/* eslint-disable  */
import React, { Component } from 'react';

const PRELOADNUM = 3;

export class CenterImage extends Component {
  state = {
    loading: true,
    error: false,
    loaded: false,
  }

  render() {
    const { loading, error } = this.state;
    const { index, current, lazysrc, ...childProps } = this.props;
    const img = (<img onLoad={this.onImgLoad.bind(this)} src={lazysrc} {...childProps} />);

    // init first image, others have been preloaded
    if (index === current) { return img; }
    if (loading) { return <Loading />; }
    if (error) { return <Error />; }

    return img;
  }

  componentWillMount() {
    this.loadImg();
  }

  componentWillReceiveProps() {
    !this.state.loaded && this.loadImg();
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }

  loadImg() {
    const { index, current, lazysrc } = this.props;

    if (lazysrc && index <= current + PRELOADNUM && index >= current - PRELOADNUM) {
      const img = new Image();

      img.src = lazysrc;
      img.onload = () => {
        this.setState({
          loading: false,
        });
      };
      img.onerror = () => {
        this.setState({
          loading: false,
          error: true,
        });
      };
    }
  }

  onOrientationChange(target) {
    // 方向改变后新的innerHeight生效需要delay
    setTimeout(() => {
      this.onImgLoad({ target });
    }, 100);
  }

  onImgLoad(e) {
    if (!this.state.loaded) {
      this.onOrientationChange = this.onOrientationChange.bind(this, e.target);
      window.addEventListener('orientationchange', this.onOrientationChange);
    }

    this.setState({ loaded: true });

    const target = e.target;
    const h = target.naturalHeight;
    const w = target.naturalWidth;
    const r = h / w;
    const height = window.innerHeight || window.screen.availHeight;
    const width = window.innerWidth || window.screen.availWidth;
    const rate = height / width;

    const imgStyle = {};

    if (r >= 3.5) {
      // imgStyle.width = width + "px";
      // imgStyle.height = h * width / w + "px";
      target.setAttribute('long', true);
    }

    if (r > rate) {
      imgStyle.height = `${height }px`;
      imgStyle.width = `${w * height / h }px`;
      imgStyle.left = `${width / 2 - (w * height / h) / 2 }px`;
    } else if (r < rate) {
      imgStyle.width = `${width }px`;
      imgStyle.height = `${h * width / w }px`;
      imgStyle.top = `${height / 2 - (h * width / w) / 2 }px`;
    } else {
      imgStyle.width = width;
      imgStyle.height = height;
    }

    target.setAttribute('style', `width:${imgStyle.width}; height:${imgStyle.height}; left:${imgStyle.left}; top:${imgStyle.top};`);
    target.setAttribute('rate', 1 / r);
  }
}

const Loading = () => (
  <div className="spinner">
    <div className="double-bounce1" />
    <div className="double-bounce2" />
  </div>
);

const Error = () => (
  <div className="errorpage">加载失败</div>
);
