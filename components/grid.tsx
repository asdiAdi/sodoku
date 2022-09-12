import { join } from "node:path/win32";
import React from "react";
import styles from "../styles/Grid.module.css";
import * as Sudoku from "./sudoku"


export default function Grid(prop: {difficulty: 'easy' | 'medium' | 'hard' | 'evil', newGame: boolean}) {
    const [board, setBoard] = React.useState<number[][]>();
    // const keys = new Array(81).fill(0);
    React.useEffect(() => {
        let validGrid = Sudoku.generateValidGrid();
        setBoard(Sudoku.generateSolution(validGrid, prop.difficulty));
    }, [prop.newGame]);
    // prop.sudokuArr = generateSudokuGrid();
    console.log(board)
    return (
        <div className={styles.container}>
            <div className={styles['outer-grid']}>
                {/* {board?.map((numArr, idxA) => <div className={styles['inner-grid']}>2</div>)} */}
                <div className={styles['inner-grid']}>
                    <div className={styles.item}>{board && board[0][0]>0 ? board[0][0]:null}</div>
                    <div className={styles.item}>{board && board[0][1]>0 ? board[0][1]:null}</div>
                    <div className={styles.item}>{board && board[0][2]>0 ? board[0][2]:null}</div>
                    <div className={styles.item}>{board && board[1][0]>0 ? board[1][0]:null}</div>
                    <div className={styles.item}>{board && board[1][1]>0 ? board[1][1]:null}</div>
                    <div className={styles.item}>{board && board[1][2]>0 ? board[1][2]:null}</div>
                    <div className={styles.item}>{board && board[2][0]>0 ? board[2][0]:null}</div>
                    <div className={styles.item}>{board && board[2][1]>0 ? board[2][1]:null}</div>
                    <div className={styles.item}>{board && board[2][2]>0 ? board[2][2]:null}</div>
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
                <div className={styles['inner-grid']}>
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
                {/* {t?.map((numArr, idxA) => numArr.map((num, idxB) => <div className={styles.item} key={idxA*9+idxB}>{!num ? null : num}</div>))} */}
            </div>
            {/* <button onClick={(e) => setT(Sudoku.test())}>Click Me!</button> */}
        </div>

    )
}
Grid.defaultProps = {
    difficulty: "easy",
    newGame: false
}