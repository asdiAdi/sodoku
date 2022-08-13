import { useEffect, useState } from "react";
import styles from "../styles/Grid.module.css";

function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
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
    return shuffle(possNum) as number[];
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


function generateUniqueSolution(validGrid: number[][], difficulty?: 'easy' | 'medium' | 'hard' | 'evil') {
    let numTrack: number[][][] = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
    let gridCopy = JSON.parse(JSON.stringify(validGrid));
    let clue: number = 40;
    switch (difficulty) {
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
    console.clear()
    // pick random places based on number of clues
    let randIndexes: number[][] = new Array(81).fill(0).map((val, idx) => [Math.floor((idx) / 9), (idx) % 9]);
    // console.log(...randIndexes)
    shuffle(randIndexes);
    // console.log(...randIndexes)
    // return validGrid
    let validRandIndex = [];
    for (let i = 0; i < clue && randIndexes.length > 0; i++) {
        // console.log(i)
        numTrack = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
        validRandIndex.push(randIndexes[randIndexes.length - 1]);
        randIndexes.pop();
        let indexLimit = validRandIndex.length - 1;
        for (let j = indexLimit; j >= 0 && j <= indexLimit; j--) {
            for (let k = 0; k <= j; k++) gridCopy[validRandIndex[k][0]][validRandIndex[k][1]] = 0;
            let xIndex = validRandIndex[j][0];
            let yIndex = validRandIndex[j][1];
            // possible numbers based on sub, x-axis, y-axis, and backtrack (shuffled) excluding 1st num
            let possNum = checkPossNum(gridCopy, xIndex, yIndex, [j === indexLimit ? validGrid[xIndex][yIndex] : gridCopy[xIndex][yIndex], ...numTrack[xIndex][yIndex]]);
            possNum = possNum.sort((a,b) => a-b);
            // check all possible numbers
            if (possNum.length > 0) {
                gridCopy[xIndex][yIndex] = possNum[0];
                numTrack[xIndex][yIndex].push(possNum[0]);
                if (possNum.length ===1 && j === 0) {
                    i--;
                    validRandIndex.pop();
                    break;
                } 
            } else {
                numTrack[xIndex][yIndex] = [];
                j += 2;
            }
        }
        gridCopy = JSON.parse(JSON.stringify(validGrid));
        for (let k = 0; k <= validRandIndex.length-1; k++) gridCopy[validRandIndex[k][0]][validRandIndex[k][1]] = 0;
    }
    
    // console.log(validRandIndex.length)
    // console.log(randIndexes.length)
    return gridCopy;
}

function test(t?: number[][]) {
    let cancel = false;
    let count = 0;
    let x = generateValidGrid();
    t = generateUniqueSolution(x);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (t && t[i][j] === 0) count++;
        }
    }
    console.log(count)
    // console.log(x)
    let r = t?.map(val => val.join(""))
    console.log(r?.join().replaceAll(',','').replaceAll('0','.'))
    return t;
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