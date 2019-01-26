let verticesConnection = [];

let pathMeshPoints = [];
let createPath = false;
let calculatePath = false;

let navMesh;



function calculateVerticesConnections(geometry){

    let triangles = geometry.faces;
  
    for(let i = 0; i < triangles.length; i++){
      for(let j = 0; j < 3; j++){
        if(j == 0){
          let a = new THREE.Vector3();
          a.copy(geometry.vertices[ triangles[i].a]);
          let connections = calculateVerticesAUX(triangles, a);
          
          let verticeConnect = {
            vertice: a,
            connections: connections
          }
          verticesConnection.push(verticeConnect);
  
        }else if(j == 1){
          let b = new THREE.Vector3();
          b.copy(geometry.vertices[ triangles[i].b]);
          let connections = calculateVerticesAUX(triangles, b);
          
          let verticeConnect = {
            vertice: b,
            connections: connections
          }
          verticesConnection.push(verticeConnect);
  
        }else if(j == 2){
          let c = new THREE.Vector3();
          c.copy(geometry.vertices[ triangles[i].c]);
          let connections = calculateVerticesAUX(geometry, triangles, c, );
          
          let verticeConnect = {
            vertice: c,
            connections: connections
          }
          verticesConnection.push(verticeConnect);
  
        }
      }
    }
  
    for(let i = 0; i < verticesConnection.length; i++){
      for(let j = 0; j < verticesConnection.length; j++){
        if(i != j && verticesConnection[i].vertice.equals(verticesConnection[j].vertice)){
          verticesConnection.splice(j, 1);
        } 
      }
    }
  
    
  
  }
  
  function calculateVerticesAUX(geometry, triangles, v){
    let connected = [];
    for(let i = 0; i < triangles.length; i++){
        if(v.equals(geometry.vertices[ triangles[i].a])){
  
          connected.push(geometry.vertices[ triangles[i].b]);
          connected.push(geometry.vertices[ triangles[i].c]);
  
        }else if(v.equals(geometry.vertices[ triangles[i].b])){
  
          connected.push(geometry.vertices[ triangles[i].a]);
          connected.push(geometry.vertices[ triangles[i].c]);
  
        }else if(v.equals(geometry.vertices[ triangles[i].c])){
  
          connected.push(geometry.vertices[ triangles[i].a]);
          connected.push(geometry.vertices[ triangles[i].b]);
  
        }
    }
  
    for(let i = 0; i < connected.length; i++){
        for(let j = 0; j < connected.length; j++){
          if(i != j && connected[i].equals(connected[j])){
            connected.splice(j, 1);
          } 
        }
      }
  
    return connected;
  }
  
  function calculatePathPoints(finalPoint, initialPoint){
  
    let pathVertices = [];
  
    let initialTriangle = [];
    let finalTriangle = [];
  
    let triangles = navMesh.geometry.faces;
  
    for(let i = 0; i < triangles.length; i++){
      let a = new THREE.Vector3();
      a.copy(navMesh.geometry.vertices[ triangles[i].a]);
      let b = new THREE.Vector3();
      b.copy(navMesh.geometry.vertices[ triangles[i].b]);
      let c = new THREE.Vector3();
      c.copy(navMesh.geometry.vertices[ triangles[i].c]);
      let isOrNot = PointInTriangle(initialPoint, a, b, c);
      if(isOrNot){
        initialTriangle[0] = a;
        initialTriangle[1] = b;
        initialTriangle[2] = c;
      }
      let isOrNot2 = PointInTriangle(finalPoint, a, b, c);
      if(isOrNot2){
        finalTriangle[0] = a;
        finalTriangle[1] = b;
        finalTriangle[2] = c;
      }
    }
  
    
  
    let pathPoint = calculateF(initialTriangle, initialPoint, finalPoint);
    pathVertices.push(pathPoint);
  
    for(let i = 0; i < pathVertices.length; i++){
      let tempArr = [];
      for(let j = 0; j < verticesConnection.length; j++){
        if(pathVertices[i].v.equals(verticesConnection[j].vertice)){
          tempArr = verticesConnection[j].connections;
        }
      }
   
    
      let pathPoint = calculateF(tempArr, pathVertices[i].v, finalPoint);
  
      
      var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push( pathPoint.v);
        var dotMaterial = new THREE.PointsMaterial({
          color: "rgb(255,0,0)",
          size: 5,
          sizeAttenuation: false
        });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
  
      if(pathPoint.v.equals(finalTriangle[0]) || pathPoint.v.equals(finalTriangle[1]) || pathPoint.v.equals(finalTriangle[2])){
        pathVertices.push(pathPoint);
        i = pathVertices.length;
      }else{
        pathVertices.push(pathPoint);
      }
    }
  }
  
  function compareF(a, b) {
    return a.f - b.f
  }
  
  function SameSide(p1,p2, a,b){
    let v1 = new THREE.Vector3();
    v1.copy(b).sub(a);
    let v2= new THREE.Vector3();
    v2.copy(p1).sub(a);
    let v3= new THREE.Vector3();
    v3.copy(p2).sub(a);
  
    let cp1 = new THREE.Vector3();
    cp1.crossVectors(v1, v2)
    let cp2 = new THREE.Vector3();
    cp2.crossVectors(v1, v3);
  
    let dotValue = cp1.dot(cp2);
    if (dotValue >= 0 ){
      return true
    } else {
      return false
    }
  }
  
  function PointInTriangle(p, a,b,c){
    let bool1 = SameSide(p,a, b,c);
    let bool2 = SameSide(p,b, a,c);
    let bool3 = SameSide(p,c, a,b);
  
    if(bool1 && bool2 && bool3){
      return true
    }else{
      return false
    }
  }
  
  function calculateF(arr, p, finalPoint){
    let tempResults = [];
    for(let i = 0; i < arr.length; i++){
      let g = p.distanceTo(arr[i]);
      let h = arr[i].distanceTo(finalPoint);
      let f = g + h;
      let tempValues = {
        f: f,
        v: arr[i]
      }
      tempResults.push(tempValues);
      
    }
  
    tempResults.sort(compareF);
    return tempResults[0];
    
  }
  
  