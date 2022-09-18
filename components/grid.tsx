import React from "react";
import styles from "../styles/Grid.module.css";
import * as Sudoku from "./sudoku"

type GridData = {
    ans: number,
    clue: number,
    data: number,
    noteData: number[],
    isActive: boolean,
    color: string,
    backgroundColor: string,
    nextBackgroundColor: string,
    immediateBackgroundColor: string
}
type Board =
    {
        history: Array<{ val: GridData, idxA?: number, idxB?: number, }>,
        activeTile: { idxA: number, idxB: number },
        grid: Array<Array<GridData>>,
        isWon: boolean
    }
let didInit = false;
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
const initGridData = {
    ans: 0,
    clue: 0,
    data: 0,
    noteData: [],
    isActive: false,
    color: '',
    backgroundColor: '',
    nextBackgroundColor: '',
    immediateBackgroundColor: ''
}
const initialBoard: Board = {
    history: [{ val: initGridData, idxA: undefined, idxB: undefined }],
    activeTile: { idxA: 0, idxB: 0 },
    grid: new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => {
        return {
            ans: 0,
            clue: 0,
            data: 0,
            noteData: [],
            isActive: false,
            color: '',
            backgroundColor: '',
            nextBackgroundColor: '',
            immediateBackgroundColor: ''
        };
    })),
    isWon:false
};
let prevBoard:Board = {
    history: [{ val: initGridData, idxA: undefined, idxB: undefined }],
    activeTile: { idxA: 0, idxB: 0 },
    grid: new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => {
        return {
            ans: 0,
            clue: 0,
            data: 0,
            noteData: [],
            isActive: false,
            color: '',
            backgroundColor: '',
            nextBackgroundColor: '',
            immediateBackgroundColor: ''
        };
    })),
    isWon:false
};
const reducer = (board: Board, action: { type: string, idxA?: number, idxB?: number, grid?: number[][], input?: number }) => {
    const isInSelectArea = (idxA: number, idxB: number, selectIdxA: number, selectIdxB: number): boolean => {
        if (idxA === selectIdxA) return true;
        else if (idxB === selectIdxB) return true;
        else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (selectIdxA >= i * 3 && selectIdxA <= i * 3 + 2 && idxA >= i * 3 && idxA <= i * 3 + 2) {
                        if (selectIdxB >= j * 3 && selectIdxB <= j * 3 + 2 && idxB >= j * 3 && idxB <= j * 3 + 2) return true;
                    }
                }
            }
        }
        return false;
    }
    switch (action.type) {
        case "Generate": // stores the generated board to the answer object and deletes the previous play data
            board = structuredClone(initialBoard);
            board.grid = board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) arrB.ans = action.grid[idxA][idxB];
                return arrB;
            }));
            break;
        case "AddClue": // copies tiles based on difficulty
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) {
                    arrB.clue = action.grid[idxA][idxB];
                    arrB.data = action.grid[idxA][idxB];
                };
                return arrB;
            }));
            prevBoard = structuredClone(board);
            break;
        case "Clicked": // shows the current clicked tiles by its own and surrounding background colors
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.idxA !== undefined && action.idxB !== undefined) {
                    if (idxA === action.idxA && idxB === action.idxB) {
                        arrB.isActive = true;
                        board.activeTile.idxA = action.idxA;
                        board.activeTile.idxB = action.idxB;
                        arrB.backgroundColor = '#48CAE4';
                    } else {
                        arrB.isActive = false;
                        if (isInSelectArea(action.idxA, action.idxB, idxA, idxB)) arrB.backgroundColor = '#ADE8F4';
                        else arrB.backgroundColor = '';
                        if (arrB.nextBackgroundColor !== '') arrB.backgroundColor = arrB.nextBackgroundColor;
                    }
                }
                arrB.immediateBackgroundColor = arrB.backgroundColor;
                return arrB
            }));
            break;
        case "Input": // input number from the user on a blank tile, changes color whether its wrong/correct
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.input !== undefined && arrB.isActive && arrB.clue === 0) {
                    if (action.input === arrB.data) action.input = 0;
                    // save history
                    board.history.push({ idxA: idxA, idxB: idxB, val: structuredClone(arrB) });
                    if (arrB.ans === action.input) {
                        arrB.color = "#0077B6";
                        arrB.nextBackgroundColor = '';
                    } else if (action.input !== 0) {
                        arrB.color = "#E35053";
                        arrB.nextBackgroundColor = "#F6CACC";
                    } else arrB.nextBackgroundColor = '';
                    arrB.data = action.input;
                    arrB.noteData = [];
                } else if (action.input !== undefined && arrB.data !== 0 && board.grid[board.activeTile.idxA][board.activeTile.idxB].clue === 0) {
                    if (arrB.data === action.input && arrB.data === arrB.ans) {
                        arrB.backgroundColor = '#0096C7';
                    }
                    else arrB.backgroundColor = arrB.immediateBackgroundColor;
                }
                return arrB;
            }));
            break;
        case "Undo": // undo to last edited tile  
            let lastEditedTile = board.history[board.history.length - 1];
            
            // console.log(board.history.map(v=>v.val))
            if (lastEditedTile.idxA !== undefined && lastEditedTile.idxB !== undefined) {
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB] = lastEditedTile.val;
                    reducer(board, { type: "Clicked", idxA: lastEditedTile.idxA, idxB: lastEditedTile.idxB });

                    // if (lastEditedTile.val.clue !== 0){
                    //     board.history = board.history.filter(grd => grd.idxA !== lastEditedTile.idxA && grd.idxB !== lastEditedTile.idxB);
                    //     console.log(board.history)
                    //     lastEditedTile = board.history[board.history.length - 1];
                    // }

                    board.history.pop();
            } 
            break;
        case "Erase": // erase Active Tile
            reducer(board, { type: "Input", input: 0 });
            break;
        case "AddNote": //add notes based on player input
            if (action.input !== undefined) {
                let activeTile = board.grid[board.activeTile.idxA][board.activeTile.idxB];
                board.history.push({ idxA: board.activeTile.idxA, idxB: board.activeTile.idxB, val: structuredClone(activeTile) });
                activeTile.noteData.push(action.input);
            }
            break;
        case "DisplayHint": //displays true answer on active tile
            // board.activeTile
            // board.grid[board.activeTile.idxA][board.activeTile.idxB] = structuredClone(initGridData);
            let activeTile = board.grid[board.activeTile.idxA][board.activeTile.idxB];
            board.grid[board.activeTile.idxA][board.activeTile.idxB] = {
                ans: activeTile.ans,
                clue: activeTile.ans,
                data: activeTile.ans,
                noteData: [],
                isActive: true,
                color: '',
                backgroundColor: '#48CAE4',
                nextBackgroundColor: '',
                immediateBackgroundColor: ''
            }
            board.history = board.history.filter(grd => grd.idxA !== board.activeTile.idxA && grd.idxB !== board.activeTile.idxB);
            // 
            // console.log(activeTile)
            break;
        case "Restart": // restart game with current clues
            board = structuredClone(initialBoard);
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) =>{
                arrB.ans = prevBoard.grid[idxA][idxB].ans;
                arrB.clue = prevBoard.grid[idxA][idxB].clue;
                arrB.data = prevBoard.grid[idxA][idxB].clue;
                return arrB;
            }));
            break;
        default:
            throw new Error();
    }
    // checks if won
    if (board.grid.every(arrA => arrA.every(arrB => arrB.ans === arrB.data)))board.isWon = true;
    // copies entire object so the returned value is a new reference
    // it ensures that react rerenders
    const newBoard = structuredClone(board);
    return newBoard;
}

export default function Grid(
prop: {
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'evil',
    newGameToggle: boolean,
    input: number,
    toggleInput: boolean,
    toggleUndo: boolean,
    toggleErase: boolean,
    toggleNotes: boolean,
    toggleHint: boolean,
    toggleRestart: boolean,
    // isWon: boolean,
    winToggle: () => void,
    className?: string,
}) {
    const [board, dispatch] = React.useReducer(reducer, initialBoard);
    const [prevNewGameToggle, setPrevNewGameToggle] = React.useState(prop.newGameToggle);
    const [prevToggleInput, setPrevToggleInput] = React.useState(prop.toggleInput);
    const [prevToggleUndo, setPrevToggleUndo] = React.useState(prop.toggleUndo);
    const [prevToggleErase, setPrevToggleErase] = React.useState(prop.toggleErase);
    const [prevToggleHint, setPrevToggleHint] = React.useState(prop.toggleHint);
    const [prevToggleRestart, setPrevToggleRestart] = React.useState(prop.toggleRestart);
    const handleClick = (idxA: number, idxB: number) => {
        dispatch({ type: "Clicked", idxA, idxB });
    }
    // checks if won
    React.useEffect(() => {
        if (didInit && board.isWon) prop.winToggle();
    }, [board.isWon]);
    // initialization
    React.useEffect(() => {
        if (!didInit) {
            didInit = true;
            let validGrid = Sudoku.generateValidGrid();
            dispatch({ type: "Generate", grid: validGrid });
            validGrid = Sudoku.generateSolution(validGrid, prop.difficulty);
            dispatch({ type: "AddClue", grid: validGrid });
        }
    }, []);
    // The board will update everytime the user changes difficulty
    if (prevNewGameToggle !== prop.newGameToggle) {
        let validGrid = Sudoku.generateValidGrid();
        dispatch({ type: "Generate", grid: validGrid });
        validGrid = Sudoku.generateSolution(validGrid, prop.difficulty);
        dispatch({ type: "AddClue", grid: validGrid });
        setPrevNewGameToggle(prop.newGameToggle);
    }
    if (prevToggleInput !== prop.toggleInput && !prop.toggleNotes) {
        // input a number in tile
        dispatch({ type: "Input", input: prop.input});
        setPrevToggleInput(prop.toggleInput);
    } else if (prevToggleInput !== prop.toggleInput && prop.toggleNotes) {
        // input a note in tile
        dispatch({ type: "AddNote", input: prop.input });
        setPrevToggleInput(prop.toggleInput);
    }
    // undo
    if (prevToggleUndo !== prop.toggleUndo) {
        dispatch({ type: "Undo" });
        setPrevToggleUndo(prop.toggleUndo);
    }
    if (prevToggleErase !== prop.toggleErase) {
        dispatch({ type: "Erase" });
        setPrevToggleErase(prop.toggleErase);
    }
    if (prevToggleHint !== prop.toggleHint) {
        dispatch({ type: "DisplayHint"});
        setPrevToggleHint(prop.toggleHint);
    } 
    if (prevToggleRestart !== prop.toggleRestart) {
        dispatch({ type: "Restart"});
        setPrevToggleRestart(prop.toggleRestart);
    }
    return (
        <div className={`${prop.className?prop.className:styles.container}`}>
            <div className={styles['outer-grid']}>
                {board.grid?.map((arrA, idxA) =>
                    <div className={styles['inner-grid']}>
                        {arrA.map((arrB, idxB) =>
                            <div className={styles.item} style={{ color: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['color'], backgroundColor: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['backgroundColor'] }} onClick={() => { handleClick(gridReindex(idxA, idxB, false), gridReindex(idxA, idxB, true)) }}>
                                {
                                    board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].noteData.length > 0 ?
                                        // display hint data
                                        <div className={styles['hint-grid']} style={{ color: 'black', backgroundColor: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['backgroundColor'] }}> {Array(9).fill(0).map((val, idxC) => <div>{board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].noteData.some(val => val == idxC + 1) ? idxC + 1 : null}</div>)}</div>
                                        : //display current guess data
                                        board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data ? board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data : null}
                            </div>)}
                    </div>
                )}
            </div>
        </div>
    )
}