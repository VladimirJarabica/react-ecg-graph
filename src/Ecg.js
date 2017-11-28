// @flow
import React from 'react';
import { getTime } from 'date-fns';

type Props = {
  width: number,
  height: number,
  timeWidth: ?number, // in milliseconds
  scanBarWidth: ?number,
  amplitudeRange: {
    top: number,
    bottom: number,
  },
  data: {
    amplitude: number,
    timeStamp: Date,
  },
};

class Ecg extends React.Component<Props, void> {
  context: ?CanvasRenderingContext2D;
  start: ?Date;
  opx: number = 0;
  opy: number = 0;

  static defaultProps = {
    width: 500,
    height: 100,
    timeWidth: 3000, // in milliseconds
    scanBarWidth: 20,
  };

  componentDidMount() {
    this.context = window.ecgCanvas.getContext('2d');
    this.context.strokeStyle = '#00bd00';
    this.start = getTime(new Date());

    this.context.strokeStyle = '#00bd00';
    this.context.lineWidth = 1;

    window.requestAnimationFrame(this.updateCanvas(this.context, this.props));
  }

  updateCanvas = (_, props: Props) => () => {
    const {
      data,
      scanBarWidth,
      timeWidth,
      height,
      width,
      amplitudeRange,
    } = props;
    const context = window.ecgCanvas.getContext('2d');
    // (start - getTime(data.timeStamp)) % timeWidth => place on x axis
    // between 0 and timeWidth
    const time = (getTime(data.timeStamp) - this.start) % timeWidth;
    const px = time * width / timeWidth;

    const amplitudeHeight = amplitudeRange.top - amplitudeRange.bottom;
    const py =
      (data.amplitude - amplitudeRange.bottom) * height / amplitudeHeight;

    context.clearRect(px, 0, scanBarWidth, height);
    context.beginPath();
    if (px < this.opx) {
      this.opx = 0;
    }
    context.moveTo(this.opx, this.opy);
    context.lineTo(px, py);
    context.stroke();

    // back to the start

    this.opx = px;
    this.opy = py;

  };

  componentWillReceiveProps = (nextProps: Props) => {
    window.requestAnimationFrame(this.updateCanvas(this.context, nextProps));
  };

  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { width, height } = this.props;
    return (
      <canvas
        id="ecgCanvas"
        width={width}
        height={height}
        style={{ backgroundColor: 'black' }}
      >
        Canvas ECG
      </canvas>
    );
  }
}

export default Ecg;
