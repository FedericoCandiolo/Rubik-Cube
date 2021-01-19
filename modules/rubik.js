class Block{
    constructor(params){
        this.colors = params.colors;
        this.position = params.position;
        this.direction = params.direction;
        // 'f' is correct, ['b', 'r', 'l', 'u', 'd'] are options, after rotations
    }

    copy(){
        let new_cube = new Block({colors: this.colors,
                        position: [...this.position],
                        direction: this.direction});
        return new_cube;
    }

    hasSameColor(other){
        let clr_arr_a = Array.from(this.colors);
        let clr_arr_b = Array.from(other.colors);

        if(clr_arr_a.length !== clr_arr_b.length) return false; //Same type of block?
        for(let i = 0; i < clr_arr_a.length; i++) if (!clr_arr_b.includes(clr_arr_a[i])) return false; //Has the same colors?

        return true;
    }

    hasValidPosition(){
        let pos1_counter = 0;

        for(let i = 0; i < this.position.length; i++){
            if(this.position[i] === 1) pos1_counter++;
        }
        
        return (pos1_counter <= 1 && pos1_counter + Array.from(this.colors).length === 3);
    }

    hasSamePosition(other){
        for(let i = 0; i < this.position.length; i++) if(this.position[i] !== other.position[i]) return false;
        return true;
    }

    equals(other){
        return (this.hasSameColor(other) && this.direction == other.direction && this.hasSamePosition(other));
    }

}

class Cube{

    static ALL_PIECES = 20;

    static colors = //white on the top, red on the front, blue on the right.
        [
            [ //x = 0
                ['goy', 'go', 'gow'], // y = 0 
                ['gy', 'g', 'gw'], // y = 1
                ['gry', 'gr', 'grw'], // y = 2
            ],
            [ //x = 1
                ['oy', 'o', 'ow'], // y = 0
                ['y', '', 'w'], // y = 1
                ['ry', 'r', 'rw'], // y = 2
            ],
            [ //x = 2
                ['boy', 'bo', 'bow'], // y = 0
                ['by', 'b', 'bw'], // y = 1
                ['bry', 'br', 'brw'], // y = 2
            ],
        ];
    
    static finishedCube = (new Cube()).addBlocks([
        new Block({position:[0,0,0] , direction:'f' , colors: 'goy'}),
        new Block({position:[0,0,1] , direction:'f' , colors: 'go'}),
        new Block({position:[0,0,2] , direction:'f' , colors: 'gow'}),
        new Block({position:[0,1,0] , direction:'f' , colors: 'gy'}),
        new Block({position:[0,1,2] , direction:'f' , colors: 'gw'}),
        new Block({position:[0,2,0] , direction:'f' , colors: 'gry'}),
        new Block({position:[0,2,1] , direction:'f' , colors: 'gr'}),
        new Block({position:[0,2,2] , direction:'f' , colors: 'grw'}),
        new Block({position:[1,0,0] , direction:'f' , colors: 'oy'}),
        new Block({position:[1,0,2] , direction:'f' , colors: 'ow'}),
        new Block({position:[1,2,0] , direction:'f' , colors: 'yr'}),
        new Block({position:[1,2,2] , direction:'f' , colors: 'rw'}),
        new Block({position:[2,0,0] , direction:'f' , colors: 'boy'}),
        new Block({position:[2,0,1] , direction:'f' , colors: 'bo'}),
        new Block({position:[2,0,2] , direction:'f' , colors: 'bow'}),
        new Block({position:[2,1,0] , direction:'f' , colors: 'by'}),
        new Block({position:[2,1,2] , direction:'f' , colors: 'bw'}),
        new Block({position:[2,2,0] , direction:'f' , colors: 'bry'}),
        new Block({position:[2,2,1] , direction:'f' , colors: 'br'}),
        new Block({position:[2,2,2] , direction:'f' , colors: 'brw'}),
    ]);

    static operations = ['l','lp','r','rp','b','bp','f','fp','d','dp','u','up']; //The 6 movements + primes (inverse)

    static oppositeOperation = op =>{
        let arr = Array.from(op);
        if(arr.length === 2) arr.pop();
        else arr.push("p");
        return arr.reduce((acc,el) => acc = acc + el,"");
    }

    constructor(){
        
        this.positions =
        [
            [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
        ];
        
    }
    
    addBlock(block){
        let pos = block.position;
        this.positions[pos[0]][pos[1]][pos[2]] = block;        
    }

    addBlocks(blocks){
        for(let i = 0; i < blocks.length; i++) this.addBlock(blocks[i]);
        return this;
    }

    equals(other){
        let are_equals = true;

        if(this.amountOfPieces() !== other.amountOfPieces()) return false;
        let this_pos_flat = this.positions.flat(2);
        let other_pos_flat = other.positions.flat(2);
        for(let i = 0; i < this_pos_flat.length; i++){
            if(this_pos_flat[i] === null && other_pos_flat[i] !== null) return false;
            if(this_pos_flat[i] !== null && other_pos_flat[i] === null) return false;
            else if(this_pos_flat[i] !== null) if(!this_pos_flat[i].equals(other_pos_flat[i])) return false;
        }

        return true;
    }

    getModifiedCube(axis_var, pos_var,posChange, dir_change){
        //axis_var is the axis where the cube will rotate
        //pos_var is the position at that axis where the rotation will occur
        //posChange(i,j) takes the (x,y) , (x,z) , (y,z) that are the non axis_var axises. It means how will they change
        //dir_change is an object. It takes the changes of direction
        const new_cube = new Cube();
        for(let i=0; i<=2;i++){
            for(let j=0;j<=2;j++){
                for(let k=0;k<=2;k++){
                    let non_copied_block;
                    if(axis_var == 'x') non_copied_block = this.positions[k][i][j];
                    else if(axis_var == 'y') non_copied_block = this.positions[i][k][j];
                    else if(axis_var == 'z') non_copied_block = this.positions[i][j][k];
                    else console.error("No falling: " + axis_var);
                    if(non_copied_block){ //check it's not null
                        let block = non_copied_block.copy();
                        if(k===pos_var){ //We're at the position where the blocks move
                            //Position change
                            let new_pos = posChange(i,j);
                                //The axis where the movement is done doesn't change
                            if(axis_var == 'x') block.position = [k, new_pos[0], new_pos[1]];
                            else if(axis_var == 'y') block.position = [new_pos[0], k, new_pos[1]];
                            else if(axis_var == 'z') block.position = [new_pos[0], new_pos[1], k];
                            else console.error("No falling: " + axis_var);

                            //Direction change
                            let dir = block.direction;
                            dir = dir_change[dir];
                            block.direction = dir;                                
                        }
                        new_cube.addBlock(block);
                    }
                }
            }
        }
        
        return new_cube;   
    }

    move(dir){
        let new_cube;

        const dir_change = {
            l: {l: 'l',  r: 'r',  b: 'u',  f: 'd',  d: 'b',  u: 'f'},
            r: {l: 'l',  r: 'r',  b: 'd',  f: 'u',  d: 'f',  u: 'b'},
            b: {l: 'd',  r: 'u',  b: 'b',  f: 'f',  d: 'r',  u: 'l'},
            f: {l: 'u',  r: 'd',  b: 'b',  f: 'f',  d: 'l',  u: 'r'},
            d: {l: 'f',  r: 'b',  b: 'l',  f: 'r',  d: 'd',  u: 'u'},
            u: {l: 'b',  r: 'f',  b: 'r',  f: 'l',  d: 'd',  u: 'u'},
        }

        const pos_change = {
            axis_cw: (y,z)=>{return [z,2-y]},
            axis_acw: (y,z)=>{return [2-z,y]},
        }

        switch (dir) {
            //r' = l por ser inverso (en rotacion, no axis) -> Aplica a todos los casos
            
            case 'l': 
                new_cube = this.getModifiedCube('x', 0 , pos_change['axis_acw'], dir_change['l']);
                break;
            case 'lp':
                new_cube = this.getModifiedCube('x', 0 , pos_change['axis_cw'], dir_change['r']);
                break;
                
            case 'r':
                new_cube = this.getModifiedCube('x', 2 , pos_change['axis_cw'], dir_change['r']);
                break;
            case 'rp': 
                new_cube = this.getModifiedCube('x', 2 , pos_change['axis_acw'], dir_change['l']);
                break;
            
            case 'b': 
                new_cube = this.getModifiedCube('y', 0 , pos_change['axis_acw'], dir_change['b']);
                break;
            case 'bp':
                new_cube = this.getModifiedCube('y', 0 , pos_change['axis_cw'], dir_change['f']);
                break;

            case 'f':
                new_cube = this.getModifiedCube('y', 2 , pos_change['axis_cw'], dir_change['f']);
                break;
            case 'fp': 
                new_cube = this.getModifiedCube('y', 2 , pos_change['axis_acw'], dir_change['b']);
                break;
            
            case 'd': 
                new_cube = this.getModifiedCube('z', 0 , pos_change['axis_acw'], dir_change['d']);
                break;
            case 'dp':
                new_cube = this.getModifiedCube('z', 0 , pos_change['axis_cw'], dir_change['u']);
                break;

            case 'u':
                new_cube = this.getModifiedCube('z', 2 , pos_change['axis_cw'], dir_change['u']);
                break;
            case 'up': 
                new_cube = this.getModifiedCube('z', 2 , pos_change['axis_acw'], dir_change['d']);
                break;          
            
                
            default:
                break;
        }
        return new_cube;
    }

    moveMany(dirs){
        let moves = dirs.split(',');
        let cube = this;
        for(let i = 0; i < moves.length; i++) cube = cube.move(moves[i]);
        return cube;
    }

    amountOfPieces(){
        let arr = this.positions.flat(2).reduce((acc,el)=> acc + (el == null ? 0 : 1), 0);
        return arr;
    }

    hasAllPieces(){
        return (this.amountOfPieces() == Cube.ALL_PIECES);
    }

    isFinished(){    
        let i = 0;
        while(i <  this.positions.length){
            let j = 0;

            while(j < this.positions[i].length){
                let k = 0;
                while(k < this.positions[i][j].length){
                    let block = this.positions[i][j][k]
                    if(block){
                        let standard = new Block({colors: Cube.colors[i][j][k], position : [i,j,k], direction: 'f'});
                        if(!block.equals(standard)) return false;
                    }

                    k++;
                }

                j++;
            }

            i++;
        }

        return true;
    }
    
    isInCube(other_block){
        let i = 0;

        while(i <  this.positions.length){
            let j = 0;

            while(j < this.positions[i].length){
                let k = 0;
                while(k < this.positions[i][j].length){
                    block = this.positions[i][j][k]
                    if(block){
                        if(block.equals(other_block)) return true;
                    }
                }

                j++;
            }

            i++;
        }
        return false;
    }

    isValidCube(){
        let flatten_arr = this.positions.flat(2).filter(block => block !== null);
        if(flatten_arr.length != Cube.ALL_PIECES) return false;
        while(flatten_arr.length > 0){
            let block = flatten_arr.shift();
            for(let i = 0; i< flatten_arr.length; i++){
                if(block.hasSameColor(flatten_arr[i]) || !block.hasValidPosition()
                 || block.hasSamePosition(flatten_arr[i])) return false;
            }
        }

        return true;
    }

    solve(){
        //const listHas = (l, a) => l.filter(el => el.equals(a)).length !== 0;
        const listHas = (l, a) => (l.filter(el => el.equals(a)).length !== 0); 
            

        if(this.isValidCube){
            let ordered_turn = false;

            let queue_disordered = [];
            let done_disordered = [];
            let prev_cubes_set_disordered = [];

            let queue_ordered = [];
            let done_ordered = [];
            let prev_cubes_set_ordered = [];

            queue_ordered.push({cube: Cube.finishedCube, prev_op: '', prev_cube: null});
            queue_disordered.push({cube: this, prev_op: '', prev_cube: null});

            //GET FROM QUEUE AND START DOING MOVEMENTS UNTIL THERE'S AN INSTANCE OF THE CUBE SOLVED. RETURN THE QUEUE
            let isFinished = false;
            while(queue_ordered.length && queue_disordered.length && !isFinished){ //TENGO QUE SEGUIR ACA
                ordered_turn = !ordered_turn;
                if(ordered_turn){           
                    let actual = queue_ordered.shift();
                    if(!listHas(prev_cubes_set_ordered, actual.cube)){
                        prev_cubes_set_ordered.push(actual.cube);
                        done_ordered.push(actual);
                        if(listHas(prev_cubes_set_disordered, actual.cube)) isFinished = true;
                        else{
                            for(let i = 0; i < Cube.operations.length; i++) queue_ordered.push({cube: actual.cube.move(Cube.operations[i]) , prev_op: Cube.operations[i] , prev_cube: actual.cube});
                        }
                    }
                }
                else{           
                    let actual = queue_disordered.shift();
                    if(!listHas(prev_cubes_set_disordered, actual.cube)){
                        prev_cubes_set_disordered.push(actual.cube);
                        done_disordered.push(actual);
                        if(listHas(prev_cubes_set_ordered, actual.cube)) isFinished = true;
                        else{
                            for(let i = 0; i < Cube.operations.length; i++) queue_disordered.push({cube: actual.cube.move(Cube.operations[i]) , prev_op: Cube.operations[i] , prev_cube: actual.cube});
                        }
                    }
                }
            }
            let last_ordered;
            let last_disordered;
            let path = [];

            //GET BOTH LAST ELEMENTS
            if(ordered_turn){
                last_ordered = done_ordered.pop();
                for(let i = 0; i < done_disordered.length; i++){
                    if(done_disordered[i].cube.equals(last_ordered.cube)){
                        last_disordered = done_disordered[i];
                        break;
                    }
                }
            }
            else{
                last_disordered = done_disordered.pop();
                for(let i = 0; i < done_ordered.length; i++){
                    if(done_ordered[i].cube.equals(last_disordered.cube)){
                        last_ordered = done_ordered[i];
                        break;
                    }
                }
            }

            //RETRIEVE FROM DONE MOVEMENTS THE LIST OF OPERATIONS
            //RETRIEVE FROM DISORDERED
            while(last_disordered.prev_op){
                path.unshift(last_disordered.prev_op);
                for(let i = done_disordered.length-1; i >= 0; i--) if(done_disordered[i].cube === last_disordered.prev_cube) {
                    last_disordered = done_disordered[i];
                    //done_disordered.splice(i,1);
                    break;
                }
            }

            while(last_ordered.prev_op){
                path.push(Cube.oppositeOperation(last_ordered.prev_op));
                for(let i = done_ordered.length-1; i >= 0; i--) if(done_ordered[i].cube === last_ordered.prev_cube) {
                    last_ordered = done_ordered[i];
                    //done_ordered.splice(i,1);
                    break;
                }
            }
            
            return path;
        }
        else return null;
    }


/* 
    // FORMA DE RESOLVER LENTA PERO FUNCIONA
    solve(){
        let queue = [];
        let done = [];
        let prev_cubes_set = new Set();
        let Cube.operations = ['l','lp','r','rp','b','bp','f','fp','d','dp','u','up']; //The 6 movements + primes (inverse)
        if(this.isValidCube){
            queue.push({cube: this, prev_op: '', prev_cube: null});

            //GET FROM QUEUE AND START DOING MOVEMENTS UNTIL THERE'S AN INSTANCE OF THE CUBE SOLVED. RETURN THE QUEUE
            let isFinished = false;
            while(queue.length && !isFinished){
                let actual = queue.shift();
                if(!prev_cubes_set.has(actual.cube)){
                    prev_cubes_set.add(actual.cube);
                    done.push(actual);
                    if(actual.cube.isFinished()) isFinished = true;
                    else{
                        for(let i = 0; i < Cube.operations.length; i++) queue.push({cube: actual.cube.move(Cube.operations[i]) , prev_op: Cube.operations[i] , prev_cube: actual.cube});
                    }
                }
            }
            //RETRIEVE FROM DONE MOVEMENTS THE LIST OF Cube.operations
            let last = done.pop();
            let path = [];
            while(last.prev_op){
                path.unshift(last.prev_op);
                for(let i = done.length-1; i >= 0; i--) if(done[i].cube === last.prev_cube) {
                    last = done[i];
                    break;
                }
            }
            return path;
        }
        else return null;
    } */
}