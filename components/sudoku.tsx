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
// Backtracking algorithm extremely slow! Max of 40 hints only
// TODO: implement a faster algorithm that generates a unique solution down to 17 hints
function generateSolution(validGrid: number[][], difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'evil' = 'easy', isUnique: boolean = false) {
    let numTrack: number[][][] = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
    let gridCopy = JSON.parse(JSON.stringify(validGrid));
    let clue: number;
    switch (difficulty) {
        case 'easy':
            clue = Math.floor(Math.random() * (45 - 37) + 37);
            break;
        case 'medium':
            clue = Math.floor(Math.random() * (37 - 29) + 29);
            break;
        case 'hard':
            clue = Math.floor(Math.random() * (29 - 22) + 22);
            break;
        case 'expert':
            clue = Math.floor(Math.random() * (22 - 19) + 19);
            break;
        case 'evil':
            clue = Math.floor(Math.random() * (19 - 17) + 17);
            break;
    }
    console.clear()
    // pick random places based on number of clues
    let randIndexes: number[][] = new Array(81).fill(0).map((val, idx) => [Math.floor((idx) / 9), (idx) % 9]);
    shuffle(randIndexes);
    let validRandIndex = [];

    if (isUnique) {
        //only easy is good for unique boards due to the slow speed of the algorithm
        for (let i = 0; i < 81 - clue && randIndexes.length > 0; i++) {
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
                // check all possible numbers
                if (possNum.length > 0) {
                    gridCopy[xIndex][yIndex] = possNum[0];
                    numTrack[xIndex][yIndex].push(possNum[0]);
                    if (j === 0) {
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
            for (let k = 0; k <= validRandIndex.length - 1; k++) gridCopy[validRandIndex[k][0]][validRandIndex[k][1]] = 0;
        }
        return gridCopy;

    } else {
        //return grid with multiple solutions
        //no algorithm so this is the fastest for medium - evil
        for (let i = 0; i < 81 - clue && randIndexes.length > 0; i++) {
            gridCopy[randIndexes[i][0]][randIndexes[i][1]] = 0;
        }
        return gridCopy;
    }

}
function solveGrid(numArray: number[][]) {
    let numTrack: number[][][] = Array(9).fill(0).map(() => Array(9).fill(0).map(() => Array(9).fill(0)));
    let gridCopy: number[][] = JSON.parse(JSON.stringify(numArray));
    let blankIndexes: number[][] = [];
    // get all the coordinates of blank spaces
    gridCopy.forEach((valA, idxA) => valA.forEach((valB, idxB) => valB === 0 ? blankIndexes.push([idxA, idxB]) : undefined))
    for (let i = 0; i < blankIndexes.length && i >= 0; i++) {
        let xIndex = blankIndexes[i][0];
        let yIndex = blankIndexes[i][1];
        let possNum = checkPossNum(gridCopy, xIndex, yIndex, numTrack[xIndex][yIndex]);
        if (i === 0) console.log(`i: ${i} possnum:${possNum} idx:${blankIndexes[i]}`)
        if (possNum.length > 0) {
            gridCopy[xIndex][yIndex] = possNum[0];
            numTrack[xIndex][yIndex].push(possNum[0]);
            if (i === blankIndexes.length - 1) return gridCopy; //solved grid
        } else {
            if (i === 0) { console.log("not viable"); return gridCopy; }//not viable
            numTrack[xIndex][yIndex] = [];
            gridCopy[blankIndexes[i > 0 ? i - 1 : 0][0]][blankIndexes[i > 0 ? i - 1 : 0][1]] = 0;
            i -= 2;
        }
    }
}
export {
    generateSolution,
    generateValidGrid,
    solveGrid
}