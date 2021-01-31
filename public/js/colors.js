let colors = ["o", "g", "w", "b", "y", "r"]
let colors_code = ["rgb(255, 124, 18)", "rgb(4, 186, 37)", "rgb(255, 255, 255)", "rgb(4, 15, 186)", "rgb(255, 203, 18)", "rgb(186, 30, 4)"];

function solutionWrite(str){
    document.getElementById("solution").textContent = str;
}

function getColor(code){
    let i = colors_code.length -1;
    while (i>=0 && colors_code[i] != code) i--;
    if(i>=0) return colors[i];
    return 0;
}

function nextColor(id){
    let block = document.getElementById(id);
    let color = block.style.backgroundColor;
    for(let i = 0; i < colors_code.length; i++){
        if(color == colors_code[i]){
            block.style.backgroundColor = colors_code[(i+1) % colors_code.length];
        }
    }
}

function translateCube(table){
    function getInputsFromTag(tag){
        return Array.from(tag.children).map(child=>{
            if(child.tagName === "INPUT") return {id: child.id, col: getColor(child.style.backgroundColor)};
            else if(child.children) return (getInputsFromTag(child))
        })
    }

    function getDirection(tuple){
        let colors = {
            g: { dir:'l', op: 'b', coords: {x:-1,y:0,z:0} },
            b: { dir:'r', op: 'g', coords: {x:1,y:0,z:0} },
            o: { dir:'b', op: 'r', coords: {x:0,y:-1,z:0} },
            r: { dir:'f', op: 'o', coords: {x:0,y:1,z:0} },
            y: { dir:'d', op: 'w', coords: {x:0,y:0,z:-1} },
            w: { dir:'u', op: 'y', coords: {x:0,y:0,z:1} },
        }

        solutionWrite("Solving");

        let vert_prod = (col1, col2) => {            
            let coords1 = colors[col1].coords;
            let coords2 = colors[col2].coords;

            let result = {
                x: coords1.y * coords2.z - coords1.z * coords2.y,
                y: coords1.z * coords2.x - coords1.x * coords2.z,
                z: coords1.x * coords2.y - coords1.y * coords2.x,
            }
            return result;
        };

        //It has red or orange?
        for(let i=0; i < tuple.length; i++){
            if(tuple[i].col === 'r') return colors[tuple[i].id[2]].dir; //Direction of the face of the color it is
            if(tuple[i].col === 'o') return colors[ colors[tuple[i].id[2]].op ].dir; //Direction of the oposite face it is
        }

        //Else it is GW, BW, GY or  BY
        let two_colors = tuple.map(x=>x.col);
        let edge = "";
        let final_coords = [];

        if(two_colors.includes('g') && two_colors.includes('w')) edge ="gw";
        else if(two_colors.includes('b') && two_colors.includes('w')) edge ="wb";
        else if(two_colors.includes('b') && two_colors.includes('y')) edge ="by";
        else if(two_colors.includes('g') && two_colors.includes('y')) edge ="yg";

        two_colors.map(col=>{
            for(let i=0; i<tuple.length;i++){
                if(tuple[i].col == col){
                    return tuple[i].id[2];
                }
            }
            return null;
        })

        final_coords = vert_prod(...two_colors);

        for(color in colors){
            if(colors[color].coords.x == final_coords.x &&
                colors[color].coords.y == final_coords.y &&
                colors[color].coords.z == final_coords.z) return colors[color].dir;
        }

        return null;
    }
    
    //HTML tags to id and color
    let inputs = getInputsFromTag(table).flat(7);
    let cube = new Cube();

    let blocks = //ids
    [
        [ //x = 0
            [["00o","00g","02y"], ["10o","01g"], ["20o","02g","00w"]], // y = 0
            [["12y","10g"], null, ["12g","10w"]], // y = 1
            [["22y","20g","20r"], ["21g","10r"], ["22g","20w","00r"]], // y = 2
        ],
        [ //x = 1
            [["01o","01y"], null, ["21o","01w"]], // y = 0
            [null, null, null], // y = 1
            [["21y","21r"], null, ["21w","01r"]], // y = 2
        ],
        [ //x = 2
            [["02b","02o","00y"], ["12o","01b"], ["02w","22o","00b"]], // y = 0
            [["12b","10y"], null, ["12w","10b"]], // y = 1
            [["22b","20y","22r"], ["21b","12r"], ["22w","20b","02r"]], // y = 2
        ],
    ];

    for(let i=0; i<blocks.length; i++)
    for(let j=0; j<blocks[i].length; j++)
    for(let k=0; k<blocks[i][j].length; k++){
        let tuple = blocks[i][j][k];

        if(tuple !== null){
            //get the color asociated
            for(let l=0; l<tuple.length; l++)
            for(let j=0; j<inputs.length; j++){
                if(tuple[l] === inputs[j].id){
                    tuple[l] = inputs[j];
                    break;
                }
            }

            //convert into the blocks format
            let position = [i,j,k];
            let colors = tuple.reduce((acc, el) => acc + el.col,"");
            let direction = getDirection(tuple);

            let new_block = new Block({colors, position, direction});
            cube.addBlock(new_block);
        }

    }
    
    console.log(cube);

    if(!cube.isValidCube()) solutionWrite("Unable to solve. Invalid cube.");
    else if(cube.isFinished()) solutionWrite("The cube is already finished.");
    else{
        solutionWrite("Solving... Please wait.");

        setTimeout(()=>{
            let path = cube.solve();
            if(path) solutionWrite(path.toString());
            else solutionWrite("ERROR");
        },200);
    }

}