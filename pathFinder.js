class PathFinder {
  constructor(geometry) {
    this.geometry = geometry;
    this.verticesConnection = this.calculateVerticesConnections();
  }
    // main
    calculateVerticesConnections(){

      let triangles = this.geometry.faces;
      let auxArr = [];
    
      for(let i = 0; i < triangles.length; i++){
        for(let j = 0; j < 3; j++){
          if(j == 0){
            let a = new THREE.Vector3();
            a.copy(this.geometry.vertices[ triangles[i].a]);
            let connections = this.calculateVerticesAUX(triangles, a);
            
            let verticeConnect = {
              vertice: a,
              connections: connections
            }
            auxArr.push(verticeConnect);
    
          }else if(j == 1){
            let b = new THREE.Vector3();
            b.copy(this.geometry.vertices[ triangles[i].b]);
            let connections = this.calculateVerticesAUX(triangles, b);
            
            let verticeConnect = {
              vertice: b,
              connections: connections
            }
            auxArr.push(verticeConnect);
    
          }else if(j == 2){
            let c = new THREE.Vector3();
            c.copy(this.geometry.vertices[ triangles[i].c]);
            let connections = this.calculateVerticesAUX(triangles, c, );
            
            let verticeConnect = {
              vertice: c,
              connections: connections
            }
            auxArr.push(verticeConnect);
    
          }
        }
      }
    
      for(let i = 0; i < auxArr.length; i++){
        for(let j = 0; j < auxArr.length; j++){
          if(i != j && auxArr[i].vertice.equals(auxArr[j].vertice)){
            auxArr.splice(j, 1);
          } 
        }
      }

      return auxArr;
    }
    
    calculateVerticesAUX(triangles, v){
      let connected = [];
      for(let i = 0; i < triangles.length; i++){
          if(v.equals(this.geometry.vertices[ triangles[i].a])){
    
            connected.push(this.geometry.vertices[ triangles[i].b]);
            connected.push(this.geometry.vertices[ triangles[i].c]);
    
          }else if(v.equals(this.geometry.vertices[ triangles[i].b])){
    
            connected.push(this.geometry.vertices[ triangles[i].a]);
            connected.push(this.geometry.vertices[ triangles[i].c]);
    
          }else if(v.equals(this.geometry.vertices[ triangles[i].c])){
    
            connected.push(this.geometry.vertices[ triangles[i].a]);
            connected.push(this.geometry.vertices[ triangles[i].b]);
    
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

    // secondary
    calculatePathPoints(initialPoint, finalPoint ){
    
      let pathVertices = [];
    
      let initialTriangle = [];
      let finalTriangle = [];
    
      let triangles = this.geometry.faces;
    
      for(let i = 0; i < triangles.length; i++){
        let a = new THREE.Vector3();
        a.copy(this.geometry.vertices[ triangles[i].a]);
        let b = new THREE.Vector3();
        b.copy(this.geometry.vertices[ triangles[i].b]);
        let c = new THREE.Vector3();
        c.copy(this.geometry.vertices[ triangles[i].c]);
        let isOrNot = this.PointInTriangle(initialPoint, a, b, c);
        if(isOrNot){
          initialTriangle[0] = a;
          initialTriangle[1] = b;
          initialTriangle[2] = c;
        }
        let isOrNot2 = this.PointInTriangle(finalPoint, a, b, c);
        if(isOrNot2){
          finalTriangle[0] = a;
          finalTriangle[1] = b;
          finalTriangle[2] = c;
        }
      }
    
      let pathPoint = this.calculateF(initialTriangle, initialPoint, finalPoint);
      pathVertices.push(pathPoint);
    
      for(let i = 0; i < pathVertices.length; i++){
        let tempArr = [];
        for(let j = 0; j < this.verticesConnection.length; j++){
          if(pathVertices[i].v.equals(this.verticesConnection[j].vertice)){
            tempArr = this.verticesConnection[j].connections;
          }
        }
    
        let pathPoint = this.calculateF(tempArr, pathVertices[i].v, finalPoint);
        if(pathPoint.v.equals(finalTriangle[0]) || pathPoint.v.equals(finalTriangle[1]) || pathPoint.v.equals(finalTriangle[2])){
          pathVertices.push(pathPoint);
          break;
        }else{
          pathVertices.push(pathPoint);
        }
      }

      return pathVertices;
    }
    
    compareF(a, b) {
      return a.f - b.f
    }
    
    SameSide(p1,p2, a,b){
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
    
    PointInTriangle(p, a,b,c){
      let bool1 = this.SameSide(p,a, b,c);
      let bool2 = this.SameSide(p,b, a,c);
      let bool3 = this.SameSide(p,c, a,b);
    
      if(bool1 && bool2 && bool3){
        return true
      }else{
        return false
      }
    }
    
    calculateF(arr, p, finalPoint){
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
    
      tempResults.sort(this.compareF);
      return tempResults[0];
      
    }
  }
  