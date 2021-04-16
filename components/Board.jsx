import React from 'react';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.pressCeld = this.pressCeld.bind(this);
        this.markCeld = this.markCeld.bind(this);
    }

    getCeldClassName(celd) {
        switch (celd) {
            case 'UNPRESSED': return 'unpressed';
            case 'MINE':      return 'mine';
            case 'MARKED':    return 'marked';
            default:

                if (typeof celd === 'number') {
                    return `pressed_${celd}`;
                }

                return '';
        }
    }

    getCeldContent(celd) {
        return '';
    }

    pressCeld(event) {
        event.preventDefault();
        const i = parseInt(event.target.getAttribute('i'));
        const j = parseInt(event.target.getAttribute('j'));
        this.props.pressCeld(i, j);
        return false;
    }

    markCeld(event) {
        event.preventDefault();
        const i = parseInt(event.target.getAttribute('i'));
        const j = parseInt(event.target.getAttribute('j'));
        this.props.markCeld(i, j);
        return false;
    }

    get tbody() {
        const tb = [];

        for(let i = 0; i < this.props.game.height; i++) {
            const tr = [];
            for(let j = 0; j < this.props.game.width; j++) {
                const celd = this.props.game.celds[i][j]; // integer, UNPRESSED, MARKED, TO_PRESS, TO_MARK, MINE
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
        return this.props.game ? (
            <table className="mines-board">
                <tbody>
                    { this.tbody }
                </tbody>
            </table>
        ) : <div>Gaming: { this.props.gaming ? 'YES' : 'NO' }</div>;
    }
}