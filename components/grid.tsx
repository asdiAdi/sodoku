import { log } from "console";
import type { ReactElement } from "react";
import styles from "../styles/Grid.module.css";
let trial = [
    ['0.0', 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
    ['1.0', 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
    ['2.0', 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
    ['3.0', 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8],
    ['4.0', 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8],
    ['5.0', 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8],
    ['6.0', 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8],
    ['7.0', 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8],
    ['8.0', 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8]
]


function generateSudokuGrid(){
    let numArray: number[][] = new Array(9).fill(new Array(9));
    let numTrack: number[][] = new Array(9).fill(new Array(9).fill(0));
    // topLeft pos:     [0,0] -> [2,2] [1,2] 
    // topMiddle pos:   [0,3] -> [2,5]
    // topRight pos:    [0,6] -> [2,8]
    // midLeft pos:     [3,0] -> [5,2]
    // midMiddle pos:   [3,3] -> [5,5]
    // midRight pos:    [3,6] -> [5,8]
    // botLeft pos:     [6,0] -> [8,2]
    // botMiddle pos:   [6,3] -> [8,5]
    // botRight pos:    [6,6] -> [8,8]

    // Generate valid map
    // 1. start at 0,0 end at 8,8
    // 2. check possible numbers based on subgroup
    // 3. check possible numbers based on x axis
    // 4. check possible numbers based on y axis
    // 5. pick random value on possible numbers

    // Backtracking algo checks if it has only 1 soln if not backtrack
    // 1. pick random place that is not null to remove
    // 2. bakctrack loop
    //  2.1 check possible numbers based on sub, x-axis, y-axis (sorted)
    //  2.2 if possible check next non-null and repeat 2.1
    //  2.3 else return false
    //  2.4 if all non-null is checked and only 1 solution is found return true
    //  2.5 else if more than 1 solution is found, skip this number and remember the position so as to not get picked again


    // 1.
    // numArray[Math.floor(Math.random())]
    for (let i = 0; i < numArray.length; i++){
        for (let j = 0; j < numArray[i].length; j++){
            let naNum: number[] = [   //not available numbers
                ...numArray[i], //y axis
                ...numArray.map(val=>val[i]),  //x axis
                ...numArray.filter((valA, idxA) => {    //subgroup
                    let xLimit = Math.floor(i/3)*3;
                    let yLimit = Math.floor(j/3)*3;
                    if (idxA >= xLimit && idxA < xLimit +3){
                        return valA.filter((valB, idxB)=> idxB >= yLimit && idxB < yLimit+3);
                    }
                }).flatMap(val=>val!)
            ]
            numArray[i][j] = randomNum(naNum);
        }
    }
    console.log(trial.flatMap((valA, idxA) => {    //subgroup
        let xLimit = Math.floor(4/3)*3;
        let yLimit = Math.floor(3/3)*3;
        if (idxA >= xLimit && idxA < xLimit +3){
            return valA.filter((valB, idxB)=> idxB >= yLimit && idxB < yLimit+3);
        }
        else return null;
    }).map(val=>val!))
    return numArray;
}

function randomNum(arrA: number[]){
    arrA = Array.from(new Set(arrA));   //remove duplicates
    let arrB = [0,1,2,3,4,5,6,7,8]
    let numbers = arrA.filter(x=>!arrB.includes(x));
    return (Math.floor(Math.random()*numbers.length));
}


export default function Grid(prop: { sudokuArr?: number[][] }) {
    generateSudokuGrid();
    // prop.sudokuArr = generateSudokuGrid();
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {prop.sudokuArr?.map((numArr) => numArr.map((num) => <div className={styles.item}>{num}</div>) )}
            </div>
        </div>

    )
}
Grid.defaultProps = {
    sudokuArr: [
        ['0.0', 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        ['1.0', 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
        ['2.0', 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
        ['3.0', 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8],
        ['4.0', 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8],
        ['5.0', 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8],
        ['6.0', 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8],
        ['7.0', 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8],
        ['8.0', 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8]
    ]
}