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
  /*
    * imgFigure 的点击处理函数
    */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }


  render() {

    let styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度值有值且不为零，添加旋转角度
    if(this.props.arrange.rotate) {
      (['Moz','ms','Webkit','']).forEach(function(value){
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
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
      imgsArranageArr: []
    };
  }
  /*
   * 翻转图片
   * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */
  inverse(index) {
    return function() {
      let imgsArranageArr = this.state.imgsArranageArr;

      imgsArranageArr[index].isInverse = !imgsArranageArr[index].isInverse;

      this.setState({
        imgsArranageArr: imgsArranageArr
      });
    }.bind(this);
  }
  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
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

        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

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
  /*
   * 利用arrange函数， 居中对应index的图片
   * @param index, 需要被居中的图片对应的图片信息数组的index值
   * @returns {Function}
   */
  center(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
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
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure key={index}  data={value} ref={'imgFigure' + index}
       arrange={this.state.imgsArranageArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
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
