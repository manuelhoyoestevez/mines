import React from 'react';
import Board from '../core/board';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.width = 30;
        this.height = 16;
        this.mines = [];

        const total = this.width * this.height;

        for(let k = 0; k < 99; k++) {
            const val = Math.floor(total * Math.random());
            this.mines.push({
                i: Math.floor(val / this.width),
                j: val % this.width
            });
        }
        
        this.state = { board: new Board(this.width, this.height, this.mines) };

        this.pressCeld = this.pressCeld.bind(this);
        this.markCeld = this.markCeld.bind(this);
    }

    getCeldClassName(celd) {
        if (celd === 'UNPRESSED') {
            return 'unpressed';
        }

        if (celd === 'MINE') {
            return 'mine';
        }

        if (typeof celd === 'number') {
            return `pressed_${celd}`;
        }

        return '';
    }

    getCeldContent(celd) {
        return '';
    }

    pressCeld(event) {
        event.preventDefault();
        const i = parseInt(event.target.getAttribute('i'));
        const j = parseInt(event.target.getAttribute('j'));
        this.setState(state => {
            state.board.press(i, j);
            return state;
        });
        return false;
    }

    markCeld(event) {
        event.preventDefault();
        console.log('markCeld!!!', event.target);
        return false;
    }

    get tbody() {
        const tb = [];

        for(let i = 0; i < this.state.board.height; i++) {
            const tr = [];
            for(let j = 0; j < this.state.board.width; j++) {
                const celd = this.state.board.celds[i][j];
                tr.push(
                    <td key={ j }
                        i={ i }
                        j={ j }
                        className={ this.getCeldClassName(celd) }
                        onClick={ this.pressCeld }
                        onContextMenu= { this.markCeld }
                    >{ this.getCeldContent(celd) }</td>
                );
            }

            tb.push(<tr key={ i }>{ tr }</tr>);
        }

        return tb;
    }


    render() {
        return (
            <div>
                <table className="mines-board">
                    <tbody>
                        { this.tbody }
                    </tbody>
                </table>
            </div>
        );
    }
}
