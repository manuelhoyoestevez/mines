import React from 'react';
import Board from './Board.jsx';
import UserInterface from '../core/UserInterface';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            gaming: false,
            game: null,
            params: {
                width: this.props.width || 10,
                height: this.props.height || 10,
                mines: this.props.mines || 20,
            },
            statuses: {
                width: '',
                height: '',
                mines: ''
            },
            messages: {
                width: '',
                height: '',
                mines: ''
            }
        }

        this.valueChanged = this.valueChanged.bind(this);
        this.playPressed = this.playPressed.bind(this);
        this.pressCeld = this.pressCeld.bind(this);
        this.markCeld = this.markCeld.bind(this);
    }

    valueChanged(event) {
        event.preventDefault();
        const name = event.target.name;
        const value = parseInt(event.target.value);
        
        this.setState(state => {
            state.params[name] = value;
            state.messages[name] = '';
            state.statuses[name] = '';
            return state;
        });
        return false;
    }

    playPressed(event) {
        event.preventDefault();
        this.setState(state => {
            const { width, height, mines } = state.params;

            if (width <= 0) {
                state.messages.width = 'Invalid width';
                state.statuses.width = 'invalid';
            } else {
                state.statuses.width = 'valid';
            }

            if (height <= 0) {
                state.messages.height = `Invalid height: ${height}`;
                state.statuses.height = 'invalid';
            } else {
                state.statuses.height = 'valid';
            }

            if (mines <= 0) {
                state.messages.mines = `Invalid mines: ${mines}`;
                state.statuses.mines = 'invalid';
            } else if (mines >= height * width) {
                state.messages.mines = `Too many mines: ${mines}`;
                state.statuses.mines = 'invalid';
            } else {
                state.statuses.mines = 'valid';
            }

            state.game = UserInterface.generateGame(height, width, mines);
            state.gaming = true;
            return state;
        });
        return false;
    }

    pressCeld(i, j) {
        this.setState(state => {
            state.game.pressCeld(i, j);
            return state;
        });
    }

    markCeld(i, j) {
        this.setState(state => {
            state.game.markCeld(i, j);
            return state;
        });
    }

    render() {
        return (
            <form onSubmit={this.playPressed}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group row">
                            <label className="col-sm-6 col-form-label" htmlFor="width">Width</label>
                            <div className="col-sm-6">
                                <input
                                    id="width"
                                    name="width"
                                    type="number"
                                    step="1"
                                    defaultValue={this.props.width}
                                    onChange={this.valueChanged}
                                    className={`form-control is-${this.state.statuses.width}`}
                                    aria-describedby="widthHelp"
                                    placeholder="Width"
                                />
                            </div>
                            <small id="widthHelp" className={`form-text text-danger`}>
                                { this.state.messages.width } 
                            </small>

                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group row">
                            <label className="col-sm-6 col-form-label" htmlFor="height">Height</label>
                            <div className="col-sm-6">
                                <input
                                    id="height"
                                    name="height"
                                    type="number"
                                    step="1"
                                    defaultValue={this.props.height}
                                    onChange={this.valueChanged}
                                    className={`form-control is-${this.state.statuses.height}`}
                                    aria-describedby="heigthHelp"
                                    placeholder="Heigth"
                                />
                            </div>
                            <small id="heigthHelp" className={`form-text text-danger`}>
                                { this.state.messages.height }
                            </small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group row">
                            <label className="col-sm-6 col-form-label" htmlFor="mines">Mines</label>
                            <div className="col-sm-6">
                                <input
                                    id="mines"
                                    name="mines"
                                    type="number"
                                    step="1"
                                    defaultValue={this.props.mines}
                                    onChange={this.valueChanged}
                                    className={`form-control is-${this.state.statuses.mines}`}
                                    aria-describedby="minesHelp"
                                    placeholder="Mines"
                                />
                            </div>
                            <small id="widthHelp" className={`form-text text-danger`}>
                                { this.state.messages.mines } 
                            </small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary">Play!</button>
                    </div>
                </div>
                <div>Status: {this.state.game ? this.state.game.status : '' }</div>
                <div>Remain: {this.state.game ? this.state.game.remain : '' }</div>
                <Board game={this.state.game} gaming={this.state.gaming} pressCeld={this.pressCeld} markCeld={this.markCeld}></Board>
            </form>
        );
    }
}
