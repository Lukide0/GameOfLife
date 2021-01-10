function GameOfLife(canvas, genDiv) {
    this.canvas = canvas;
    this.genDiv = genDiv;
    this.context = canvas.getContext("2d");
    this.stop = true;
    this.speed = 500;

    this.drawRect = function (x,y,size, color = "#ecf0f1", fillColor = "#2c3e50", sizeRect = null) {
        sizeRect = (sizeRect == null) ? size : sizeRect;

        this.context.strokeStyle= color;
        
        this.context.strokeRect(x*size, y*size, sizeRect, sizeRect);
    
    
        if (fillColor !== null) {
            this.context.fillStyle= fillColor;
            this.context.fillRect(x*size, y*size, sizeRect, sizeRect);
        }
    }
    
    
    this.drawGrid = function (width,height,size) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.drawRect(x,y,size, "#ecf0f1", "#2c3e50");            
            }  
        }
    }
    this.clear = function() {
        this.genDiv.innerText = 0;
        this.create(this.width, this.height);
        this.stop = true;
    }

    this.create = function(width, height) {
        this.cells = {};
        this.width = width;
        this.height = height;
        this.size = 25;
        this.canvas.setAttribute("width", width*this.size);
        this.canvas.setAttribute("height", height*this.size);

        this.drawGrid(width, height, this.size);

        for (let y = 0; y < height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < width; x++) {
                this.cells[y][x] = new Cell(x,y);
            }
        }


        this.canvas.onclick = (event) => {
            let bounding = this.canvas.getBoundingClientRect();
            let x = Math.floor((event.pageX - bounding.left)/ this.size);
            let y =  Math.floor((event.pageY - bounding.top)/ this.size);

            if (this.cells[y][x].isAlive === false) {
                this.cells[y][x].isAlive = true;
                this.drawRect(x,y,this.size,"#2c3e50", "#ecf0f1", this.size-1);
            } else {
                this.cells[y][x].isAlive = false;
                this.drawRect(x,y,this.size,"#ecf0f1", "#2c3e50", this.size-1); 
            }           
        }
    }

    this.check = function() {
        for (const y in this.cells) {
            let row = this.cells[y];
            for (let index = 0; index < row.length; index++) {
                row[index].checkNeighbors(this.cells);                
            }
        }
    }
    this.turn = function() {
        this.genDiv.innerText = parseInt(this.genDiv.innerText) + 1;
        this.check();
        for (const y in this.cells) {
            let row = this.cells[y];
            for (let index = 0; index < row.length; index++) {
                row[index].turn(this.context, this.size);                
            }
        }
    }

    this.run = function() {
        this.timer = setInterval(()=> {
            if (this.stop) {
                clearInterval(this.timer);
            }
            this.turn();
        }, this.speed);
    }


}

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.isAlive = false;
    this.isAliveNextTurn = false;

    this.checkNeighbors = function(obj) {
        let countAlive = 0;
        let neighbors = [];

        for (let y = 0; y < 3; y++) {
            let posY = y + this.y - 1;
            if (obj.hasOwnProperty(posY)) {
                for (let x = 0; x < 3; x++) {
                    if (y == 1 && x == 1) continue;
                    let posX = x + this.x - 1;

                    if (typeof obj[posY][posX] !== "undefined") neighbors.push(obj[posY][posX]);
                }
            }
        }


        for (let index = 0; index < neighbors.length; index++) {
            let otherCell = neighbors[index];

            if (otherCell.isAlive === true) countAlive++;

            if (countAlive >= 4) {
                if (this.isAlive === true) {
                    this.isAliveNextTurn = false;
                }
                return;
            }
        }

        if (this.isAlive === true) {
            if (countAlive <= 1) this.isAliveNextTurn = false;
            else if (countAlive != 2 && countAlive != 3) this.isAliveNextTurn = false;
            else this.isAliveNextTurn = true;

        } else {
            if (countAlive == 3) {
                this.isAliveNextTurn = true;
            }
        }
        

    }
    this.turn = function(ctx, size) {
        if (this.isAliveNextTurn === true && this.isAlive === false) {
            this.live(ctx, size);
        } else if (this.isAliveNextTurn === false && this.isAlive === true) {
            this.die(ctx, size);
        }
    }

    this.die = function (ctx, size) {
        this.isAlive = false;
        this.render(ctx, size, false)
    }

    this.live = function(ctx, size) {
        this.isAlive = true;
        this.render(ctx, size, true)
    }

    this.render = function(context,size,alive) {
        let stroke = (alive) ? "#2c3e50" : "#ecf0f1";
        let fill   = (alive) ? "#ecf0f1" : "#2c3e50";
        context.strokeStyle= stroke;
        
        context.clearRect(this.x*size, this.y*size, size-1, size-1);
        context.strokeRect(this.x*size, this.y*size, size-1, size-1);
        
        context.fillStyle= fill;
        context.fillRect(this.x*size, this.y*size, size-1, size-1);
    } 
}