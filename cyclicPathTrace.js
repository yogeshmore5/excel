function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
  //Dependency-> Visited, dfsvisited(2D array)
  let [srcr, srcc] = cycleResponse
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

  /* for(let i = 0 ; i < rows; i++){
    for(let j = 0; j < cols; j++) {
      if(visited[i][j] === false) {
        let response = dfsCycleDetectionTracePath(graphComponentMatrix, i,j, visited, dfsVisited)

        if(response === true){
            return true;
        }
      }
    }
  } */
  let response = dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited)
  if(response == true){
    return true;
  }

  return false;
}

function dfsCycleDetectionTracePath(graphComponentMatrix, srcr,srcc, visited, dfsVisited) {
  visited[srcr][srcc] = true
  dfsVisited[srcr][srcc] = true

  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
  cell.style.backgroundColor = 'lightblue'

  for(let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++){
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if(visited[nbrr][nbrc] ===  false) {
      let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited)

      if(response === true) {
        cell.style.backgroundColor = "transparent"
        return true;
      }


    } else if( visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true ) {
        let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);
        cyclicCell.style.backgroundColor = 'lightsalmon';
        cyclicCell.style.backgroundColor = 'transparent';


        return true;
    }
  }

  dfsVisited[srcr][srcc] = false
  return false;
}