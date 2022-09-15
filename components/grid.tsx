import { join } from "node:path/win32";
import React, { SyntheticEvent } from "react";
import styles from "../styles/Grid.module.css";
import * as Sudoku from "./sudoku"

type Board =
    {
        history: Array<{val:number, idxA?: number, idxB?: number,  }>,
        grid: Array<Array<{
            ans: number,
            clue: number,
            data: number,
            isActive: boolean,
            color: string,
            backgroundColor: string,
            nextBackgroundColor: string,
            immediateBackgroundColor: string
        }>>
    }

// idx: current count in the array
// reindex array due to the positioning of the grid
function gridReindex(idxA: number, idxB: number, idx: boolean): number {
    let idxBTemp = idxB;
    if (idxA === 0 || idxA === 3 || idxA === 6) {
        if (idxB >= 3) {
            idxA += 1;
            idxBTemp -= 3;
        }
        if (idxB >= 6) {
            idxA += 1;
            idxBTemp -= 3;
        }
    } else if (idxA === 1 || idxA === 4 || idxA === 7) {
        if (idxB <= 2) {
            idxA -= 1;
            idxBTemp += 3;
        }
        if (idxB >= 6) {
            idxA += 1;
            idxBTemp -= 3;
        }
    } else {
        if (idxB <= 5) {
            idxA -= 1;
            idxBTemp += 3;
        }
        if (idxB <= 2) {
            idxA -= 1;
            idxBTemp += 3;
        }
    }

    if (!idx) return idxA;
    else return idxBTemp;

}
// const initialBoard1 = new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => { return { ans: 0, clue: 0, data: 0, isActive: false, color: '', backgroundColor: '', nextBackgroundColor:'', immediateBackgroundColor:'' } }));
const initialBoard: Board = {
    history: [{ val:0, idxA: undefined, idxB: undefined }],
    grid: new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => {
        return {
            ans: 0,
            clue: 0,
            data: 0,
            isActive: false,
            color: '',
            backgroundColor: '',
            nextBackgroundColor: '',
            immediateBackgroundColor: ''
        }
    }))
};
const reducer = (board: Board, action: { type: string, idxA?: number, idxB?: number, grid?: number[][], input?: number }) => {
    // board: {history:  {idxA?:number, idxB?:number}[], grid: { ans: number, clue: number, data: number | number[], isActive: boolean, color: string, backgroundColor: string, nextBackgroundColor: string, immediateBackgroundColor:string }[][]
    // return board;

    switch (action.type) {
        case "Generate":
            // stores the generated board to the answer object and deletes the previous play data
            if (action.grid !== undefined) board.history = [{val:0, idxA: undefined, idxB: undefined}];
            board.grid = board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) {
                    arrB.ans = action.grid[idxA][idxB];
                    arrB.clue = 0;
                    arrB.data = 0;
                    arrB.isActive = false;
                    arrB.color = '';
                    arrB.backgroundColor = '';
                    arrB.nextBackgroundColor = '';
                    arrB.immediateBackgroundColor = '';
                }
                return arrB;
            }));
            break;
        case "AddClue":
            // copies tiles based on difficulty

            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) {
                    arrB.clue = action.grid[idxA][idxB];
                    arrB.data = action.grid[idxA][idxB];
                };
                return arrB;
            }));
            break;
        case "Clicked":
            // shows the current clicked tiles by its own and surrounding bacground colors
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                let rdxA = gridReindex(idxA, idxB, false);
                let rdxB = gridReindex(idxA, idxB, true);
                if (action.idxA !== undefined && action.idxB !== undefined) {
                    if (idxA === action.idxA && idxB === action.idxB) {
                        arrB.isActive = true;
                        arrB.backgroundColor = '#48CAE4';
                    } else {
                        arrB.isActive = false;
                        if (action.idxA === idxA) arrB.backgroundColor = '#ADE8F4';
                        else if (action.idxB === idxB) arrB.backgroundColor = '#ADE8F4';
                        else arrB.backgroundColor = '';
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (idxA >= i * 3 && idxA <= i * 3 + 2 && action.idxA >= i * 3 && action.idxA <= i * 3 + 2) {
                                    if (idxB >= j * 3 && idxB <= j * 3 + 2 && action.idxB >= j * 3 && action.idxB <= j * 3 + 2) arrB.backgroundColor = '#ADE8F4';
                                }
                            }
                        }
                        if (arrB.nextBackgroundColor !== '') arrB.backgroundColor = arrB.nextBackgroundColor;
                    }
                }
                arrB.immediateBackgroundColor = arrB.backgroundColor;
                return arrB
            }));
            break;
        case "Input":
            // input number from the user on a blank tile, changes color whether its wrong/correct
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.input !== undefined && arrB.isActive && arrB.clue === 0) {
                    // save history
                    let lastEditedTile = board.history[board.history.length-1];
                    if(lastEditedTile.idxA!==idxA || lastEditedTile.idxB!==idxB)board.history.push({idxA:idxA, idxB:idxB, val:arrB.data});

                    arrB.data = action.input;
                    if (arrB.ans === action.input) {
                        arrB.color = "#0077B6";
                        arrB.nextBackgroundColor = '';
                    }
                    else {
                        arrB.color = "#E35053";
                        // detect current clicked tiles and surroundings
                        // for (let i = 0; i <9; i++){
                        //     for (let j = 0; j <9; j++){
                        //         if (i === idxA && board[i][j].data === action.input){ // vertical
                        //             board[i][j].backgroundColor = '#F6CACC';
                        //             board[i][j].nextBackgroundColor = '#F6CACC';
                        //             board[i][j].immediateBackgroundColor = '#F6CACC';
                        //         } if(j === idxB && board[i][j].data === action.input){ // horizontal
                        //             board[i][j].backgroundColor = '#F6CACC';
                        //             board[i][j].nextBackgroundColor = '#F6CACC';
                        //             board[i][j].immediateBackgroundColor = '#F6CACC';
                        //         }
                        //         // square
                        //         if (Math.floor(idxA/3) === Math.floor(i/3)){
                        //             if (Math.floor(idxB/3) === Math.floor(j/3) && board[i][j].data === action.input) {
                        //                 board[i][j].backgroundColor = '#F6CACC';
                        //                 board[i][j].nextBackgroundColor = '#F6CACC';
                        //                 board[i][j].immediateBackgroundColor = '#F6CACC';
                        //             }
                        //         }
                        //     }
                        // }
                        arrB.nextBackgroundColor = "#F6CACC";
                    }
                } else if (action.input !== undefined && arrB.data !== 0) {
                    if (arrB.data === action.input && arrB.data === arrB.ans) {
                        arrB.backgroundColor = '#0096C7';
                    }
                    else arrB.backgroundColor = arrB.immediateBackgroundColor;
                }
                return arrB;
            }));
            break;
        case "Undo":
            // undo to last edited tile
            let lastEditedTile = board.history[board.history.length-1];
            if (lastEditedTile.idxA!==undefined && lastEditedTile.idxB!==undefined){
                board.grid[lastEditedTile.idxA][lastEditedTile.idxB].data = lastEditedTile.val;
                board.history.pop();
                // console.log('hmmmm')
            }
            // board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
            //     let lastEditedTile = board.history[board.history.length-1];
                
            //     return arrB;
            // }));
            break;
        default:
            throw new Error();
    }
    // copies entire object so the returned value is a new reference
    // it ensures that react rerenders
    const newBoard = structuredClone(board);
    return newBoard;
}

export default function Grid(prop: { difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'evil', newGameToggle: boolean, input: number, toggleInput: boolean, toggleUndo: boolean }) {
    const [itemSelect, setItemSelect] = React.useState<boolean[][]>(new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => false)));
    const [board, dispatch] = React.useReducer(reducer, initialBoard);
    // const keys = new Array(120).fill(0).map((val, idx) => idx);
    const handleClick = (e: SyntheticEvent, idxA: number, idxB: number) => {
        dispatch({ type: "Clicked", idxA, idxB });
    }

    // The board will update everytime the user changes difficulty
    React.useEffect(() => {
        let validGrid = Sudoku.generateValidGrid();
        dispatch({ type: "Generate", grid: validGrid });
        validGrid = Sudoku.generateSolution(validGrid, prop.difficulty);
        dispatch({ type: "AddClue", grid: validGrid });
    }, [prop.newGameToggle]);

    // color reset
    React.useEffect(() => {
        dispatch({ type: "Input", input: prop.input });
    }, [prop.input, prop.toggleInput]);

    // undo
    React.useEffect(() => {
        dispatch({ type: "Undo", input: prop.input });
    }, [prop.toggleUndo]);

    
    return (
        <div className={styles.container}>
            <div className={styles['outer-grid']}>
                {board.grid?.map((arrA, idxA) =>
                    <div className={styles['inner-grid']}>
                        {arrA.map((arrB, idxB) =>
                            <div className={styles.item} style={{ color: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['color'], backgroundColor: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['backgroundColor'] }} onClick={(e) => { handleClick(e, gridReindex(idxA, idxB, false), gridReindex(idxA, idxB, true)) }}>
                                {!board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data ? null : board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data}
                            </div>)}
                    </div>
                )}
            </div>


            {/* <div className={styles['hint-grid']}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                        <div>9</div>
                    </div> */}
        </div>

    )
}