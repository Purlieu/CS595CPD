import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class InfoSheet extends React.Component {
    render() {
        return (
            <div className="info">
                <h4>{this.props.name}</h4>
                <p>Generations: {this.props.generationNumber}</p>

            </div>
        )
    }
}

class Box extends React.Component {
    selectBox = () =>{
        this.props.selectBox(this.props.rows, this.props.cols)
    }


    render(){
        return (
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }
}

class Grid extends React.Component {
    constructor(){
        super();
    }

    render(){
        const rowNumber = 14
        const width = this.props.cols * rowNumber;
        var rowsArray  = [];
        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++){
            for(var j = 0; j < this.props.cols; j++){
                let boxID = i + "_" + j;

                boxClass = this.props.gridFill[i][j] ? "box on" : "box off";
                rowsArray.push(
                    <Box
                        boxClass={boxClass}
                        key={boxID}
                        boxID={boxID}
                        rows={i}
                        cols={j}
                        selectBox = {this.props.selectBox}
                    />
                )

            }
    }
        return (

            <div className="grid" style={{width: width}}>
                {rowsArray}
                <InfoSheet
                    name={this.props.name}
                    generationNumber={this.props.generationNumber}
                />
            </div>
        );
    }
}
class Main extends React.Component {
    constructor() {
        super();
        this.speed = 100;
        this.rows = 45;
        this.cols = 95;


        this.state = {
            generation: 0,
            name: "Game Of Life",
            gridFill: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
    }

    selectBox = (rows, cols) => {
        let gridCopy = JSON.parse(JSON.stringify(this.state.gridFill));
        gridCopy[rows][cols] = !gridCopy[rows][cols]
        this.setState({
            gridFill: gridCopy
        })
    }

    seed = () => {
        let gridCopy = JSON.parse(JSON.stringify(this.state.gridFill));
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFill: gridCopy
        });
    }
    play = () => {
        let g = this.state.gridFill;
        let g2 = JSON.parse(JSON.stringify(this.state.gridFill));

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;
                if (i > 0) if (g[i - 1][j]) count++;
                if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
                if (j < this.cols - 1) if (g[i][j + 1]) count++;
                if (j > 0) if (g[i][j - 1]) count++;
                if (i < this.rows - 1) if (g[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
                if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
                if (!g[i][j] && count === 3) g2[i][j] = true;
            }
        }
        this.setState({
            gridFill: g2,
            generation: this.state.generation + 1
        })
    }

    playButton = () => {
        clearInterval(this.intervalID)
        this.intervalID = setInterval(this.play, this.speed)
    }


    componentDidMount(){
        this.seed();
        this.playButton();
    }


    render(){
        return (
            <div>
                <Grid
                    gridFill={this.state.gridFill}
                    rows ={this.rows}
                    cols ={this.cols}
                    selectBox ={this.selectBox}
                    name={this.state.name}
                    generationNumber={this.state.generation}
                />

            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
