import React from "react";
import styles from "../styles/Grid.module.css";
import * as Sudoku from "./sudoku"

type Board =
    {
        history: Array<{ val: number, idxA?: number, idxB?: number, }>,
        activeTile: {idxA: number, idxB: number },
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
// const initialBoard1 = new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => { return { ans: 0, clue: 0, data: 0, isActive: false, color: '', backgroundColor: '', nextBackgroundColor:'', immediateBackgroundColor:'' } }));
const initialBoard: Board = {
    history: [{ val: 0, idxA: undefined, idxB: undefined }],
    activeTile: {idxA: 0, idxB: 0 },
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
    const isInSelectArea = (idxA:number, idxB:number, selectIdxA:number, selectIdxB:number):boolean => {
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

        case "Generate":

            // stores the generated board to the answer object and deletes the previous play data
            if (action.grid !== undefined) board.history = [{ val: 0, idxA: undefined, idxB: undefined }];
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
        case "Input":
            // input number from the user on a blank tile, changes color whether its wrong/correct
            board.grid.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.input !== undefined && arrB.isActive && arrB.clue === 0) {
                    // save history
                    let lastEditedTile = board.history[board.history.length - 1];
                    if (lastEditedTile.val !== action.input) board.history.push({ idxA: idxA, idxB: idxB, val: arrB.data });

                    arrB.data = action.input;
                    if (arrB.ans === action.input) {
                        arrB.color = "#0077B6";
                        arrB.nextBackgroundColor = '';
                    }
                    else {
                        arrB.color = "#E35053";
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
            let lastEditedTile = board.history[board.history.length - 1];
            if (lastEditedTile.idxA !== undefined && lastEditedTile.idxB !== undefined) {
                board.grid[lastEditedTile.idxA][lastEditedTile.idxB].data = lastEditedTile.val;
                if (lastEditedTile.val === board.grid[lastEditedTile.idxA][lastEditedTile.idxA].ans) {
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].color = "#0077B6";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].backgroundColor = "";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].nextBackgroundColor = "";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].immediateBackgroundColor = "";
                } else if (lastEditedTile.val !== 0) {
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].color = "#E35053";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].backgroundColor = "#F6CACC";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].nextBackgroundColor = "#F6CACC";
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].immediateBackgroundColor = "#F6CACC";
                } else if (isInSelectArea(lastEditedTile.idxA, lastEditedTile.idxB, board.activeTile.idxA, board.activeTile.idxB)){
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].color = '#ADE8F4';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].backgroundColor = '#ADE8F4';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].nextBackgroundColor = '';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].immediateBackgroundColor = '#ADE8F4';
                } else {
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].color = '';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].backgroundColor = '';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].nextBackgroundColor = '';
                    board.grid[lastEditedTile.idxA][lastEditedTile.idxB].immediateBackgroundColor = '';
                }
                board.history.pop();
            }
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
    const [prevNewGameToggle, setPrevNewGameToggle] = React.useState(prop.newGameToggle);
    const [prevToggleInput, setPrevToggleInput] = React.useState(prop.toggleInput);
    const [prevToggleUndo, setPrevToggleUndo] = React.useState(prop.toggleUndo);
    const handleClick = (idxA: number, idxB: number) => {
        dispatch({ type: "Clicked", idxA, idxB });
    }
    // const keys = new Array(120).fill(0).map((val, idx) => idx);
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
    // color reset
    if (prevToggleInput !== prop.toggleInput) {
        dispatch({ type: "Input", input: prop.input });
        setPrevToggleInput(prop.toggleInput);
    }
    // undo
    if (prevToggleUndo !== prop.toggleUndo) {
        dispatch({ type: "Undo" });
        setPrevToggleUndo(prop.toggleUndo);
    }

    return (
        <div className={styles.container}>
            <div className={styles['outer-grid']}>
                {board.grid?.map((arrA, idxA) =>
                    <div className={styles['inner-grid']}>
                        {arrA.map((arrB, idxB) =>
                            <div className={styles.item} style={{ color: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['color'], backgroundColor: board.grid[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['backgroundColor'] }} onClick={() => { handleClick(gridReindex(idxA, idxB, false), gridReindex(idxA, idxB, true)) }}>
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