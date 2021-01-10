function Templates(gameOfLifeClass) {
    this.use = function(name) {
        if (!templates.hasOwnProperty(name)) return;
        
        let arr = this.templates[name]();

        this.render(arr);
        
    }
    
    let moveX = 10;
    let moveY = 20;
    
    this.star = function() {
        return [
            [0,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,0,0,0,0],
            [0,0,1,1,1,0,1,1,1,0,0],
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,1,1,0,0,0,0,0,1,1,0],
            [1,1,0,0,0,0,0,0,0,1,1],
            [0,1,1,0,0,0,0,0,1,1,0],
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,0,1,1,1,0,1,1,1,0,0],
            [0,0,0,0,1,1,1,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,0,0]
        ];
    }

    this.glider = function () {
        return [
            [1,1,1],
            [0,0,1],
            [0,1,0]
        ]
    }

    this.table = function() {
        return [
            [1,1,1,1],
            [1,0,0,1]
        ]
    }

    this.stable = function() {
        return [[1,1],[1,1]]
    }

    this.render = (arr) => {
        gameOfLifeClass.clear();

        for (let y = 0; y < arr.length; y++) {
            let row = arr[y];
            
            for (let x = 0; x < row.length; x++) {

                let cell = gameOfLifeClass.cells[y+ moveY][x+ moveX];
                let col = row[x];
                if (col == 1) cell.live(gameOfLifeClass.context, gameOfLifeClass.size);                
            }
        }
    }
    this.templates = {
        "star": this.star,
        "glider": this.glider,
        "table": this.table,
        "stable": this.stable
    }
    

}