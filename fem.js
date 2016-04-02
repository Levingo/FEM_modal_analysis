function FEM() {
    this.vertices=[] // each item is THREE.vector3 and has property - color 0-100
    this.elements=[] // each item is array of 8 vertices
    this.epsilon=0.00001

    this.geometry = new THREE.Geometry();
    this.material = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x222222, shininess: 40,
                                        side: THREE.DoubleSide, vertexColors: THREE.VertexColors} );

    this.mesh = new THREE.Mesh(this.geometry,this.material)
    this.colors=[]; //new THREE.Color(0,0.4,0.75),new THREE.Color(0,0.38,0.75)]

    for(var i=0;i<=100;i++) {
        var s=(2.4*(100-i)).toString()
        this.colors.push(new THREE.Color("hsl("+s+", 100%, 50%)"));
    }

    this.dragObjects=[]
    this.clickObjects=[]

    this.init = function() {
        this.vertices=[]
        this.elements=[]
        while (this.geometry.vertices.length>0) {this.geometry.vertices.pop();}
        while (this.geometry.faces.length>0) { this.geometry.faces.pop();}
    }

    this.xyz2vertex=function(x,y,z) {
        for(var i=0;i<this.vertices.length;i++) {
            if ((Math.abs(this.vertices[i].x-x)<this.epsilon) && (Math.abs(this.vertices[i].y-y)<this.epsilon) && (Math.abs(this.vertices[i].z-z)<this.epsilon)) {
                return i;
            }
        }
        return -1;
    }

    this.newVertex=function(x,y,z) {
        var i=this.xyz2vertex(x,y,z)
        if (i!=-1) {
            return i
        }
        this.vertices.push(new THREE.Vector3(x,y,z))
        this.vertices[this.vertices.length-1].meshVertexIndex=-1
        this.vertices[this.vertices.length-1].color=0
        return this.vertices.length-1
    }

    this.addMeshVertex=function(i) {
        if (this.vertices[i].meshVertexIndex==-1) {
            var newver=this.vertices[i].clone()
            newver.FEMvertex=i
            this.geometry.vertices.push(newver)
            this.vertices[i].meshVertexIndex=this.geometry.vertices.length-1
            return this.vertices[i].meshVertexIndex
        }
        else {
            return this.vertices[i].meshVertexIndex
        }
    }

    this.newElement=function(verticesArray, faces) {  // verticesArray = [[x,y,z],[x,y,z],...] , faces=[[0,1,2],[2,3,0],...]
        var e=[]
        for(var i=0;i<verticesArray.length;i++) {
            e.push(this.newVertex(verticesArray[i][0],verticesArray[i][1],verticesArray[i][2]))
        }
        this.elements.push(e)
        for(i=0;i<faces.length;i++) {
            var a=this.addMeshVertex(e[faces[i][0]])
            var b=this.addMeshVertex(e[faces[i][1]])
            var c=this.addMeshVertex(e[faces[i][2]])
            var normal = new THREE.Vector3( 0, 0, 1 );
            var color = new THREE.Color( 0xffaa00 );
            this.geometry.faces.push(new THREE.Face3(a,b,c,normal,color,0))
            this.geometry.faces[this.geometry.faces.length-1].verticesNumbers=[e[faces[i][0]],e[faces[i][1]],e[faces[i][2]]]

        }
        console.log('new element')

        //this.geometry.colorsNeedUpdate =true
        //this.geometry.elementsNeedUpdate=true
        //this.geometry.computeFaceNormals();
        //this.geometry.computeVertexNormals();
        //this.geometry.verticesNeedUpdate = true;
        //this.geometry.computeBoundingSphere();
    }

    this.recolor=function(mode) {
        var m=0;

        for(var i=0;i<this.vertices.length;i++) {
            m=Math.max(m,Math.pow(Math.pow(this.modes.U[mode][i*3],2)+Math.pow(this.modes.U[mode][i*3+1],2)+Math.pow(this.modes.U[mode][i*3+2],2),0.5))
        }

        for(var i=0;i<this.vertices.length;i++) {
            this.vertices[i].color=Math.round(1/m*100*Math.pow(Math.pow(this.modes.U[mode][i*3],2)+Math.pow(this.modes.U[mode][i*3+1],2)+Math.pow(this.modes.U[mode][i*3+2],2),0.5))
        }

        for(var i=0;i<this.geometry.faces.length;i++) {
            this.geometry.faces[i].vertexColors[0]=this.colors[this.vertices[this.geometry.faces[i].verticesNumbers[0]].color]
            this.geometry.faces[i].vertexColors[1]=this.colors[this.vertices[this.geometry.faces[i].verticesNumbers[1]].color]
            this.geometry.faces[i].vertexColors[2]=this.colors[this.vertices[this.geometry.faces[i].verticesNumbers[2]].color]
            this.geometry.colorsNeedUpdate =true
            //this.geometry.elementsNeedUpdate=true
        }
    }
    this.calculate=function() {

        this.modes={omega: [] , U: []}
        var U1=[];
        for(var i=0;i<this.vertices.length;i++) {
            U1.push(0,0,Math.pow((this.vertices[i].x/200),2))
        }
        this.modes.omega.push(5)
        this.modes.U.push(U1)

    }

    this.modify=function(mode,t) { //mode number and time in milliseconds
        var Amp=20*Math.cos(1.5*6.28/1000*t)
        for(var i=0;i<this.geometry.vertices.length;i++) {
            var femver=this.geometry.vertices[i].FEMvertex
            this.geometry.vertices[i].set(this.vertices[femver].x+Amp*this.modes.U[mode][femver*3],this.vertices[femver].y+Amp*this.modes.U[mode][femver*3+1],this.vertices[femver].z+Amp*this.modes.U[mode][femver*3+2])

        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
    }
}







