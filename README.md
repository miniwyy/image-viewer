React图片查看组件
===

使用`React`打造的图片查看器

【请在移动端查看效果】

特性
---

* 各类手势快速响应
* 急速滑动翻页
* 支持双指缩放、旋转、双击放大
* 支持放大后局部拖拽、翻页
* 支持超长(纵向)拼接图查看
* 支持下载
* 图片懒加载、预加载

配置说明
---

| 参数     | 类型     | 描述 | 必需 | 默认值 |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| imagelist         | array      | 要预览的图片列表 | 是 | 无 |
| current         | number      | 当前展示的图片序号（从0开始） | 否 | 0 |
| close         | function      | 图片查看器关闭方法 | 是 | |
| gap         | number      | 轮播图间距 | 否 | 30 |
| maxScale         | number      | 最大缩放倍数 | 否 | 2 |
| disablePinch      | bool       | 禁用缩小放大 | 否 | false |
| enableRotate     | bool       | 启用旋转 | 否(默认关闭) | false |
| disableDoubleTap  | bool       | 禁用双击放大 | 否 | false |
| initCallback           | function   | 初始化后回调 | 否 | |
| longTap           | function   | 长按回调 | 否 | |
| changeIndex           | function   | 轮播后回调 | 否 | |

代码演示
---

:::demo 基础用法

```jsx

import { ImageViewer } from 'components';

class Demo extends Component {
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
            './1b.png',
            './2b.png',
            './3b.png'
        ];
    return (
      <div>
          <ul>
            {imagelist.map((item, i)=>{
                return (<li key={i}><img src={item} onClick={this.show.bind(this, i)}/></li>)
            })}
          </ul>  
          {
            !!showViewer && <ImageViewer current={current} imagelist={imagelist} close={this.close.bind(this)} />
          }
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```

:::

参考代码
---

1. [react-imageview](https://github.com/AlloyTeam/AlloyViewer)

2. [react-singleton](https://github.com/Caesor/react-singleton)

3. [react-zmage](https://github.com/Caldis/react-zmage)
