import { join } from "node:path/win32";
import React, { SyntheticEvent } from "react";
import styles from "../styles/Grid.module.css";
import * as Sudoku from "./sudoku"

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
const initialBoard = new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => { return { ans: 0, clue: 0, data: 0, isActive: false, color: '', backgroundColor: '' } }));
const reducer = (board: { ans: number, clue: number, data: number | number[], isActive: boolean, color: string, backgroundColor: string }[][], action: { type: string, idxA?: number, idxB?: number, grid?: number[][], input?: number }) => {
    switch (action.type) {
        case "Generate":
            return board.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) {
                    arrB.ans = action.grid[idxA][idxB];
                    arrB.clue = 0;
                    arrB.data = 0;
                    arrB.isActive = false;
                    arrB.color = '';
                    arrB.backgroundColor = '';
                }
                return arrB;
            }));
        case "AddClue":
            return board.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.grid !== undefined) {
                    arrB.clue = action.grid[idxA][idxB];
                    arrB.data = action.grid[idxA][idxB];
                };
                return arrB;
            }));
        case "Clicked":
            return board.map((arrA, idxA) => arrA.map((arrB, idxB) => {
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
                        for (let i = 0; i<3; i++){
                            for (let j = 0; j<3; j++){
                                if (idxA >= i*3 && idxA <= i*3+2 && action.idxA >= i*3 && action.idxA <= i*3+2) {
                                    if (idxB >= j*3 && idxB <= j*3+2 && action.idxB >= j*3 && action.idxB <= j*3+2) arrB.backgroundColor = '#ADE8F4';
                                }
                            }
                        }
                    }
                }
                return arrB
            }));
        case "Input":
            return board.map((arrA, idxA) => arrA.map((arrB, idxB) => {
                if (action.input !== undefined && arrB.isActive && arrB.clue === 0) {
                    arrB.data = action.input;
                    arrB.color = "#0077B6";
                };
                return arrB;
            }));
        default:
            throw new Error();
    }
}

export default function Grid(prop: { difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'evil', newGameToggle: boolean, input: number, toggleInput: boolean }) {
    // const [board1, setBoard1] = React.useState<number[][]>();
    const [itemSelect, setItemSelect] = React.useState<boolean[][]>(new Array(9).fill(0).map(valA => new Array(9).fill(0).map(valB => false)));
    const [board, dispatch] = React.useReducer(reducer, initialBoard);
    // const [active, setActive] = React.useState<{idxA?:number, idxB?:number}>({});
    // const keys = new Array(120).fill(0).map((val, idx) => idx);
    // const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;
    const handleClick = (e: SyntheticEvent, idxA: number, idxB: number) => {
        dispatch({ type: "Clicked", idxA, idxB });
        // setActive({idxA, idxB});
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
        console.log(board)
        dispatch({ type: "Input", input: prop.input });
    }, [prop.input, prop.toggleInput]);
    return (
        <div className={styles.container}>
            <div className={styles['outer-grid']}>
                {board?.map((arrA, idxA) =>
                    <div className={styles['inner-grid']}>
                        {arrA.map((arrB, idxB) =>
                            <div className={styles.item} style={{ color: board[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['color'], backgroundColor: board[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)]['backgroundColor'] }} onClick={(e) => { handleClick(e, gridReindex(idxA, idxB, false), gridReindex(idxA, idxB, true)) }}>
                                {!board[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data ? null : board[gridReindex(idxA, idxB, false)][gridReindex(idxA, idxB, true)].data}
                            </div>)}
                    </div>
                )}

                {/* <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[0][0]>0 ? board[0][0]:null}</div>
                    <div className={styles.item}>{board && board[0][1]>0 ? board[0][1]:null}</div>
                    <div className={styles.item}>{board && board[0][2]>0 ? board[0][2]:null}</div>
                    <div className={styles.item}>{board && board[1][0]>0 ? board[1][0]:null}</div>
                    <div className={styles.item}>{board && board[1][1]>0 ? board[1][1]:null}</div>
                    <div className={styles.item}>{board && board[1][2]>0 ? board[1][2]:null}</div>
                    <div className={styles.item}>{board && board[2][0]>0 ? board[2][0]:null}</div>
                    <div className={styles.item}>{board && board[2][1]>0 ? board[2][1]:null}</div>
                    <div className={styles.item}>{board && board[2][2]>0 ? board[2][2]:null}</div>  
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[0][3]>0 ? board[0][3]:null}</div>
                    <div className={styles.item}>{board && board[0][4]>0 ? board[0][4]:null}</div>
                    <div className={styles.item}>{board && board[0][5]>0 ? board[0][5]:null}</div>
                    <div className={styles.item}>{board && board[1][3]>0 ? board[1][3]:null}</div>
                    <div className={styles.item}>{board && board[1][4]>0 ? board[1][4]:null}</div>
                    <div className={styles.item}>{board && board[1][5]>0 ? board[1][5]:null}</div>
                    <div className={styles.item}>{board && board[2][3]>0 ? board[2][3]:null}</div>
                    <div className={styles.item}>{board && board[2][4]>0 ? board[2][4]:null}</div>
                    <div className={styles.item}>{board && board[2][5]>0 ? board[2][5]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[0][6]>0 ? board[0][6]:null}</div>
                    <div className={styles.item}>{board && board[0][7]>0 ? board[0][7]:null}</div>
                    <div className={styles.item}>{board && board[0][8]>0 ? board[0][8]:null}</div>
                    <div className={styles.item}>{board && board[1][6]>0 ? board[1][6]:null}</div>
                    <div className={styles.item}>{board && board[1][7]>0 ? board[1][7]:null}</div>
                    <div className={styles.item}>{board && board[1][8]>0 ? board[1][8]:null}</div>
                    <div className={styles.item}>{board && board[2][6]>0 ? board[2][6]:null}</div>
                    <div className={styles.item}>{board && board[2][7]>0 ? board[2][7]:null}</div>
                    <div className={styles.item}>{board && board[2][8]>0 ? board[2][8]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[3][0]>0 ? board[3][0]:null}</div>
                    <div className={styles.item}>{board && board[3][1]>0 ? board[3][1]:null}</div>
                    <div className={styles.item}>{board && board[3][2]>0 ? board[3][2]:null}</div>
                    <div className={styles.item}>{board && board[4][0]>0 ? board[4][0]:null}</div>
                    <div className={styles.item}>{board && board[4][1]>0 ? board[4][1]:null}</div>
                    <div className={styles.item}>{board && board[4][2]>0 ? board[4][2]:null}</div>
                    <div className={styles.item}>{board && board[5][0]>0 ? board[5][0]:null}</div>
                    <div className={styles.item}>{board && board[5][1]>0 ? board[5][1]:null}</div>
                    <div className={styles.item}>{board && board[5][2]>0 ? board[5][2]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[3][3]>0 ? board[3][3]:null}</div>
                    <div className={styles.item}>{board && board[3][4]>0 ? board[3][4]:null}</div>
                    <div className={styles.item}>{board && board[3][5]>0 ? board[3][5]:null}</div>
                    <div className={styles.item}>{board && board[4][3]>0 ? board[4][3]:null}</div>
                    <div className={styles.item}>{board && board[4][4]>0 ? board[4][4]:null}</div>
                    <div className={styles.item}>{board && board[4][5]>0 ? board[4][5]:null}</div>
                    <div className={styles.item}>{board && board[5][3]>0 ? board[5][3]:null}</div>
                    <div className={styles.item}>{board && board[5][4]>0 ? board[5][4]:null}</div>
                    <div className={styles.item}>{board && board[5][5]>0 ? board[5][5]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[3][6]>0 ? board[3][6]:null}</div>
                    <div className={styles.item}>{board && board[3][7]>0 ? board[3][7]:null}</div>
                    <div className={styles.item}>{board && board[3][8]>0 ? board[3][8]:null}</div>
                    <div className={styles.item}>{board && board[4][6]>0 ? board[4][6]:null}</div>
                    <div className={styles.item}>{board && board[4][7]>0 ? board[4][7]:null}</div>
                    <div className={styles.item}>{board && board[4][8]>0 ? board[4][8]:null}</div>
                    <div className={styles.item}>{board && board[5][6]>0 ? board[5][6]:null}</div>
                    <div className={styles.item}>{board && board[5][7]>0 ? board[5][7]:null}</div>
                    <div className={styles.item}>{board && board[5][8]>0 ? board[5][8]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[6][0]>0 ? board[6][0]:null}</div>
                    <div className={styles.item}>{board && board[6][1]>0 ? board[6][1]:null}</div>
                    <div className={styles.item}>{board && board[6][2]>0 ? board[6][2]:null}</div>
                    <div className={styles.item}>{board && board[7][0]>0 ? board[7][0]:null}</div>
                    <div className={styles.item}>{board && board[7][1]>0 ? board[7][1]:null}</div>
                    <div className={styles.item}>{board && board[7][2]>0 ? board[7][2]:null}</div>
                    <div className={styles.item}>{board && board[8][0]>0 ? board[8][0]:null}</div>
                    <div className={styles.item}>{board && board[8][1]>0 ? board[8][1]:null}</div>
                    <div className={styles.item}>{board && board[8][2]>0 ? board[8][2]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[6][3]>0 ? board[6][3]:null}</div>
                    <div className={styles.item}>{board && board[6][4]>0 ? board[6][4]:null}</div>
                    <div className={styles.item}>{board && board[6][5]>0 ? board[6][5]:null}</div>
                    <div className={styles.item}>{board && board[7][3]>0 ? board[7][3]:null}</div>
                    <div className={styles.item}>{board && board[7][4]>0 ? board[7][4]:null}</div>
                    <div className={styles.item}>{board && board[7][5]>0 ? board[7][5]:null}</div>
                    <div className={styles.item}>{board && board[8][3]>0 ? board[8][3]:null}</div>
                    <div className={styles.item}>{board && board[8][4]>0 ? board[8][4]:null}</div>
                    <div className={styles.item}>{board && board[8][5]>0 ? board[8][5]:null}</div>
                </div>
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[6][6]>0 ? board[6][6]:null}</div>
                    <div className={styles.item}>{board && board[6][7]>0 ? board[6][7]:null}</div>
                    <div className={styles.item}>{board && board[6][8]>0 ? board[6][8]:null}</div>
                    <div className={styles.item}>{board && board[7][6]>0 ? board[7][6]:null}</div>
                    <div className={styles.item}>{board && board[7][7]>0 ? board[7][7]:null}</div>
                    <div className={styles.item}>{board && board[7][8]>0 ? board[7][8]:null}</div>
                    <div className={styles.item}>{board && board[8][6]>0 ? board[8][6]:null}</div>
                    <div className={styles.item}>{board && board[8][7]>0 ? board[8][7]:null}</div>
                    <div className={styles.item}>{board && board[8][8]>0 ? board[8][8]:null}</div>
                </div> */}
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
            {/* {t?.map((numArr, idxA) => numArr.map((num, idxB) => <div className={styles.item} key={idxA*9+idxB}>{!num ? null : num}</div>))} */}
            {/* <button onClick={(e) => setT(Sudoku.test())}>Click Me!</button> */}
        </div>

    )
}
Grid.defaultProps = {
    difficulty: "easy",
    newGame: false
}