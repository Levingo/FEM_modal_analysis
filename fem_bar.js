function femCreateBar(model) {
    sizex=200
    sizey=40
    sizez=10
    divx=20
    divy=4
    divz=4

    for(var i=0;i<divx;i++) {
        for(var j=0;j<divy;j++) {
            for(var k=0;k<divz;k++) {
                var x1=sizex*(i/divx-0.5)
                var x2=sizex*((i+1)/divx-0.5)
                var y1=sizey*(j/divy-0.5)
                var y2=sizey*((j+1)/divy-0.5)
                var z1=sizez*(k/divz)
                var z2=sizez*((k+1)/divz)
                var faces=[]
                if (i==0) faces.push([0,3,7],[0,7,4])
                if (i==divx-1) faces.push([1,2,6],[1,6,5])
                if (j==0) faces.push([0,1,5],[0,5,4])
                if (j==divy-1) faces.push([3,2,6],[3,6,7])
                if (k==0) faces.push([0,1,2],[0,2,3])
                if (k==divz-1) faces.push([4,5,6],[4,6,7])

                model.newElement([[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1],[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],faces)
            }
        }
    }

    model.geometry.elementsNeedUpdate=true
    model.geometry.computeFaceNormals();
    model.geometry.verticesNeedUpdate = true;
    model.geometry.computeBoundingSphere();

}
