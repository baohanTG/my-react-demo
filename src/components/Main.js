require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageData.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {

  for (let i = 0, j = imageDatasArr.length; i < j; i++) {

    let singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;

  }
  return imageDatasArr;
})(imageDatas);

//随机数
function getRangeRandom(low,high) {
   return Math.ceil(Math.random() * (high - low) +low);
}
//0-30
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {   // 水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {    // 垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArranageArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          }
        }*/
      ]
    };
  }

  //重新布局所有的图片
  rearrange(centetIndex) {
    let imgsArranageArr = this.state.imgsArranageArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArranageArr.splice(centetIndex, 1);

    //首先居中centerIndex图片
    imgsArrangeCenterArr[0].pos = centerPos;

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArranageArr.length - topImgNum));
    imgsArrangeTopArr = imgsArranageArr.splice(topImgSpliceIndex, topImgNum);

    //布局上不图片
    imgsArrangeTopArr.forEach(function (value, index) {

      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });


    // 布局左右两侧的图片
    for (let i = 0, j = imgsArranageArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      // 前半部分布局左边， 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArranageArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };

    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArranageArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArranageArr.splice(centetIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArranageArr: imgsArranageArr
    });

  }

  //组件加载以后计算范围
  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个figure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算图片中心位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }

  render() {
    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArranageArr[index]) {
        this.state.imgsArranageArr[index] = {
          pos: {
            left: '0',
            top: '0'
          }
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}/>)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
