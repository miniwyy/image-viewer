/* eslint-disable  */
import React, { Component } from 'react';

export default class Finger extends Component {
  constructor(props) {
    super(props);

    this.preV = { x: null, y: null };
    this.pinchStartLen = null;
    this.scale = 1;
    this.isDoubleTap = false;
    this.delta = null;
    this.last = null;
    this.now = null;
    this.end = null;
    this.multiTouch = false;
    this.tapTimeout = null;
    this.longTapTimeout = null;
    this.singleTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = null;
    this.x2 = null;
    this.y1 = null;
    this.y2 = null;
    this.preTapPosition = { x: null, y: null };
  }

  // 获取长度
  getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  // 获取点 - 来自获取角度
  dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  // 获取角度
  getAngle(v1, v2) {
    const mr = this.getLen(v1) * this.getLen(v2);
    if (mr === 0) return 0;
    let r = this.dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
  }

  // 交叉计算 - 来自获取旋转角度
  cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
  }

  // 获取转动角度
  getRotateAngle(v1, v2) {
    let angle = this.getAngle(v1, v2);
    if (this.cross(v1, v2) > 0) {
      angle *= -1;
    }

    return angle * 180 / Math.PI;
  }

  // 事件监听器
  _emitEvent(name, ...arg) {
    if (this.props[name]) {
      this.props[name](...arg);
    }
  }

  // 当按下手指时，触发ontouchstart
  _handleTouchStart(evt) {
    if (!evt.touches) return;
    this.now = Date.now();
    this.x1 = evt.touches[0].pageX;
    this.y1 = evt.touches[0].pageY;
    this.delta = this.now - (this.last || this.now);
    if (this.preTapPosition.x !== null) {
      this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
    }
    this.preTapPosition.x = this.x1;
    this.preTapPosition.y = this.y1;
    this.last = this.now;
    const preV = this.preV;
    const len = evt.touches.length;

    if (len > 1) {
      this._cancelLongTap();
      this._cancelSingleTap();
      const v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
      preV.x = v.x;
      preV.y = v.y;
      this.pinchStartLen = this.getLen(preV);
      this._emitEvent('onMultipointStart', evt);
    }
    this.longTapTimeout = setTimeout(() => {
      this._emitEvent('onLongTap', evt);
    }, 750);
  }

  // 当移动手指时，触发ontouchmove
  _handleTouchMove(evt) {
    const preV = this.preV;
    const len = evt.touches.length;
    const currentX = evt.touches[0].pageX;
    const currentY = evt.touches[0].pageY;
    this.isDoubleTap = false;
    if (len > 1) {
      const v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };
      if (preV.x !== null) {
        if (this.pinchStartLen > 0) {
          evt.center = {
            x: (evt.touches[1].pageX + currentX) / 2,
            y: (evt.touches[1].pageY + currentY) / 2,
          };
          evt.scale = this.getLen(v) / this.pinchStartLen;
          this._emitEvent('onPinch', evt);
        }
        evt.angle = this.getRotateAngle(v, preV);
        this._emitEvent('onRotate', evt);
      }
      preV.x = v.x;
      preV.y = v.y;
      this.multiTouch = true;
    } else {
      if (this.x2 !== null) {
        evt.deltaX = currentX - this.x2;
        evt.deltaY = currentY - this.y2;
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }
      this._emitEvent('onPressMove', evt);
    }
    this._cancelLongTap();
    this.x2 = currentX;
    this.y2 = currentY;
  }

  // 当一些其他的事件发生的时候（如电话接入或者弹出信息）会取消当前的touch操作，即触发ontouchcancel
  _handleTouchCancel() {
    clearInterval(this.singleTapTimeout);
    clearInterval(this.tapTimeout);
    clearInterval(this.longTapTimeout);
    clearInterval(this.swipeTimeout);
  }

  // 当移走手指时，触发ontouchend
  _handleTouchEnd(evt) {
    this.end = Date.now();
    this._cancelLongTap();

    if (evt.touches.length < 2) {
      this._emitEvent('onMultipointEnd', evt);
    }

    evt.origin = [this.x1, this.y1];
    if (this.multiTouch === false) {
      if ((this.x2 && Math.abs(this.x1 - this.x2) > 30)
                || (this.y2 && Math.abs(this.preV.y - this.y2) > 30)) {
        evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
        evt.distance = Math.abs(this.x1 - this.x2);
        this.swipeTimeout = setTimeout(() => {
          this._emitEvent('onSwipe', evt);
        }, 0);
      } else {
        this.tapTimeout = setTimeout(() => {
          this._emitEvent('onTap', evt);
          if (this.isDoubleTap) {
            this._emitEvent('onDoubleTap', evt);
            clearTimeout(this.singleTapTimeout);
            this.isDoubleTap = false;
          } else {
            this.singleTapTimeout = setTimeout(() => {
              this._emitEvent('onSingleTap', evt);
            }, 250);
          }
        }, 0);
      }
    }

    this.preV.x = 0;
    this.preV.y = 0;
    this.scale = 1;
    this.pinchStartLen = null;
    this.x1 = null;
    this.x2 = null;
    this.y1 = null;
    this.y2 = null;
    this.multiTouch = false;
  }

  // 取消长按
  _cancelLongTap() {
    clearTimeout(this.longTapTimeout);
  }

  // 取消单按
  _cancelSingleTap() {
    clearTimeout(this.singleTapTimeout);
  }

  /**
   * 切换的方向
   *
   * @param {number} x1 当触发ontouchstart时，鼠标指针相对于整个文档的X坐标
   * @param {number} x2 当触发ontouchmove时，鼠标指针相对于整个文档的X坐标
   * @param {number} y1 当触发ontouchstart时，鼠标指针相对于整个文档的Y坐标
   * @param {number} y2 当触发ontouchmove时，鼠标指针相对于整个文档的Y坐标
   * @return {string} 方向的值
   */
  _swipeDirection(x1, x2, y1, y2) {
    if (Math.abs(x1 - x2) > 80 || this.end - this.now < 250) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    }
    return 'Nochange';
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      onTouchStart: this._handleTouchStart.bind(this),
      onTouchMove: this._handleTouchMove.bind(this),
      onTouchCancel: this._handleTouchCancel.bind(this),
      onTouchEnd: this._handleTouchEnd.bind(this),
    });
  }
}
