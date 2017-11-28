import React from 'react';

import Ecg from '../src/main';

class App extends React.Component {
  state = {
    data: {
      amplitude: 0,
      timeStamp: new Date(),
    },
  };

  constructor(props) {
    super(props);

    setInterval(() => {
      this.setState({
        data: {
          amplitude: Math.floor(Math.random() * 100),
          timeStamp: new Date(),
        },
      });
    }, 10);
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <Ecg
          width={1000}
          amplitudeRange={{
            top: 100,
            bottom: 0,
          }}
          data={data}
          timeWidth={10000}
        />
      </div>
    );
  }
}

export default App;
