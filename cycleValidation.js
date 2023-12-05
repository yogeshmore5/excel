//storage 2D matrix with 100 rows and 26 columns
//This each location will contains sub-arrays which points or contains the address of other cell which has formula which uses that cell.
//Example: IF cell B2 has formula A1 + 10 then A1 cell (row = 0,cols = 0) will contain the address of B2 which is 1,1 (row = 1 and cols = 1)
let graphComponentMatrix = [];

for(let i = 0; i < rows ; i++) {
  let row = [];
  for(let j = 0; j < cols ; j++){
    //Why Array -> More than 1 child relation(Dependency)
    row.push([]);
  }
  graphComponentMatrix.push(row);
}

// True = Cyclic
// False = Not Cyclic
function isGraphCyclic(graphComponentMatrix) {
  //Dependency-> Visited, dfsvisited(2D array)
  let visited = []; //Node Visited Trace
  let dfsVisited = []; //stack trace
  for (let i = 0; i < rows ; i++ ) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for( let j = 0; j < cols; j++){
      visitedRow.push(false);
      dfsVisitedRow.push(false)
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for(let i = 0 ; i < rows; i++){
    for(let j = 0; j < cols; j++) {
      if(visited[i][j] === false) {
        let response = dfsCycleDetection(graphComponentMatrix, i,j, visited, dfsVisited)

        if(response === true){
            //return true;
            return [i,j]
        }
      }
    }
  }
  return null;
}

//Start -> Visited(true) and dfsVisited(true)
//End -> dfsVisited(false)
// if Visited == true -> already explored path, go back no use to explore again
//Cycle detection condition -> if visited == true and dfsVisited == true -> Cycle detected
//Return Boolean -> True/False i.e. Cycle/Not Cyclic
function dfsCycleDetection(graphComponentMatrix, srcr,srcc, visited, dfsVisited) {
  visited[srcr][srcc] = true
  dfsVisited[srcr][srcc] = true

  // A1 -> [[0,1],[1,0],[5,10],...]
  for(let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++){
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if(visited[nbrr][nbrc] ===  false) {
      let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited)

      if(response === true) return true; //found cycle so return immediately, no need to explore more path


    } else if( visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true ) {
        return true;  //found cycle so return immediately, no need to explore more path
    }
  }

  dfsVisited[srcr][srcc] = false
  return false;
}