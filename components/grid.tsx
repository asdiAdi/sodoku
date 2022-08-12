import { useEffect, useState } from "react";
import styles from "../styles/Grid.module.css";

function shuffle(array: number[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
function checkPossNum(numArray: number[][], xIndex: number, yIndex: number, unavblNum: number[]): number[] {
    let xNum: number[] = numArray[xIndex]; //x-axis
    let yNum: number[] = numArray.map(val => val[yIndex]);  //y-axis
    let sgNum: number[] = numArray.filter((valA, idxA) => {    //subgroup
        let xLimit = Math.floor(xIndex / 3) * 3;
        if (idxA >= xLimit && idxA < xLimit + 3) return true;
    })
        .flatMap(valA => {
            let yLimit = Math.floor(yIndex / 3) * 3;
            return valA.filter((valB, idxB) => { if (idxB >= yLimit && idxB < yLimit + 3) return true })
        });
    // get the union then difference to get possible numbers
    let naNum = Array.from(new Set([...xNum, ...yNum, ...sgNum, ...unavblNum]));
    let possNum: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    possNum = possNum.filter(num => !naNum.includes(num));
    // shuffle
    return shuffle(possNum);
}

function generateValidGrid() {
    let numArray: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    let numTrack: number[][][] = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // possible numbers based on sub, x-axis, y-axis, and backtrack (shuffled)
            let possNum = checkPossNum(numArray, i, j, numTrack[i][j]);
            if (possNum.length > 0) numArray[i][j] = possNum[0];
            else { // if there are no possible values backtrack
                // backtrack
                for (let k = 8; k >= i; k--) {
                    for (let l = 8; l >= j; l--) numTrack[k][l] = [];
                }
                if (j - 1 > -1) {
                    numTrack[i][j - 1].push(numArray[i][j - 1]);
                    numArray[i][j - 1] = 0;
                    j -= 2;
                }
                else {
                    numTrack[i - 1][8].push(numArray[i - 1][8]);
                    numArray[i - 1][8] = 0;
                    i -= 1;
                    j = 7;
                }
            }
        }
        // The i is different inside the j-loop because it is block-scoped
        // It's like it made its own variable 'i' that is different in the scope of the i-loop
        i = i;
    }
    return numArray;
}
// Backtracking algo checks if it has only 1 soln
// 1. pick random place that is not null to remove
// 2. check possible numbers based on sub, x-axis, y-axis (sorted) except original num, repeat to 1 if null
// 3. if possible add to list of solutions 
// 4. else repeat to 1.

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
//   }
function generateUniqueSolution(validGrid: number[][], difficulty?: 'easy'|'medium'|'hard'|'evil') {
    let numTrack: number[][][] = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
    let gridCopy = JSON.parse(JSON.stringify(validGrid));
    let clue: number = 81;
    switch (difficulty){
        case 'easy': 
            clue = Math.floor(Math.random() * (45 - 36) + 36);
            break;
        case 'medium':
            clue = Math.floor(Math.random() * (36 - 27) + 27);
            break;
        case 'hard':
            clue = Math.floor(Math.random() * (27 - 19) + 19);
            break;
        case 'evil':
            clue = Math.floor(Math.random() * (19 - 10) + 10);
            break;
    }
    // pick random places based on number of clues
    let randIndexes: number[][] = Array(clue);
    for(let i = 0; i < clue; i++){
        let randIndex = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)]
        if (!randIndexes.some(val => val[0]*9+val[1] === randIndex[0]*9+randIndex[1])) randIndexes[i] = randIndex;
        else i--
    }
    
    // for (let i = 0; i < clue; i++) {
    //     for (let j = randIndexes.length-1; j >=0 ; j--){
    //         // possible numbers based on sub, x-axis, y-axis, and backtrack (shuffled)
    //         let possNum = checkPossNum(gridCopy, randXIndex, randYIndex, [gridCopy[randXIndex][randYIndex]]);
    //         // if null it means there is only 1 solution so continue
    //         if (possNum.length === 0) gridCopy[randXIndex][randYIndex] = 0;
    //     } 
    // }
    return gridCopy;
}

function test(t?: number[][]) {
    let cancel = false;
    let count = 0;
    let x = generateValidGrid();
    t = generateUniqueSolution(x);
    // while (cancel === false) {
    //     t = generateValidGrid();
    //     for (let z = 0; z < t.length; z++) {
    //         for (let j = 0; j < t[z].length; j++) {
    //             if (t[z][j] === 0) {
    //                 console.log('woo');
    //                 cancel = true;
    //                 break;
    //             }
    //         }
    //     }
    //     count++;
    //     if (count > 1000) { console.log('cancelled'); cancel = true };
    // }
    // console.log(x)
    return x;
}

export default function Grid(prop: { sudokuArr?: number[][] }) {
    const [t, setT] = useState<number[][]>();
    const keys = new Array(81).fill(0);
    useEffect(() => setT(generateValidGrid()), []);
    // prop.sudokuArr = generateSudokuGrid();
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {t?.map((numArr, idx) => numArr.map((num) => <div className={styles.item}>{!num ? null : num}</div>))}
            </div>
            <button onClick={(e) => setT(test())}>Click Me!</button>
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