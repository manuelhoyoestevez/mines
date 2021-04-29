import React from 'react';
import Game from './Game.jsx'

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="card shadow">
                    <div className="card-header">
                        <h6 className="font-weight-bold text-primary">Mines</h6>
                    </div>
                    <div className="card-body">
                        <Game width="60" height="60" mines="760"></Game>
                    </div>
                </div>
            </div>
        );
    }
}
