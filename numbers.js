export default {
    board: [], //Location information array
    status: 0, //Stage information
    R1:0, //Block number information
    R2:0,
    R3:0,
    R4:0,
    B1:0,
    B2:0,
    B3:0,
    B4:0,
    y: 5,
    x: 5,
    init: function(table){
        // Initialize, create elements tr, td, etc. and mount them on the table
        document.getElementById("Stage_0").setAttribute("style","display:inline;");
        document.getElementById("Stage_1").setAttribute("style","display:none;");
        document.getElementById("Stage_2").setAttribute("style","display:none;");
        document.getElementById("Stage_3").setAttribute("style","display:none;");
        document.getElementById("Red").innerText = "";
        document.getElementById("Black").innerText = "";
        table.innerHTML = "";
        this.turn = 0;
        this.status = 0;
        this.R1 = 0;
        this.R2 = 0;
        this.R3 = 0;
        this.R4 = 0;
        this.B1 = 0;
        this.B2 = 0;
        this.B3 = 0;
        this.B4 = 0;
        this.board = [];
        document.getElementById("status").innerText = "Stage_0: Place Block";
        document.getElementById("turn").innerText = "";
        for(let i = 0; i < this.y; i++){
            let tr = document.createElement("tr");
            this.board.push([]);
            for(let j = 0; j < this.x; j++){
                let td = document.createElement("td");
                let span = document.createElement("span");
                td.appendChild(span);
                td.setAttribute("id", `${i}|${j}`);
                td.setAttribute("tabindex", -1); //The tabIndex property can be used to get keyboard input events when selected
                td.addEventListener("keydown",(event)=>{this.keyListen(event,this)});
                tr.appendChild(td);
                this.board[i].push(0); //Initialize location information array
            }
            table.appendChild(tr);
        }
    },
    nextStage: function(self){
        // Enter the next stage
        self.status++;
        self.status = self.status % 6;
        switch(self.status){
            case 0:
                document.getElementById("status").innerText = "Stage_0: Place Block";
                document.getElementById("Stage_0").setAttribute("style","display:inline;");
                document.getElementById("Stage_1").setAttribute("style","display:none;");
                document.getElementById("Stage_2").setAttribute("style","display:none;");
                document.getElementById("Stage_3").setAttribute("style","display:none;");
                break;
            case 1:
                document.getElementById("status").innerText = "Stage_1: Place Red Block";
                document.getElementById("Stage_0").setAttribute("style","display:none;");
                document.getElementById("Stage_1").setAttribute("style","display:inline;");
                document.getElementById("Stage_2").setAttribute("style","display:none;");
                document.getElementById("Stage_3").setAttribute("style","display:none;");
                break;
            case 2:
                if(self.R1+self.R2+self.R3+self.R4 == 0){
                    alert("Please add a red block");
                    self.status--;
                    return;
                }
                document.getElementById("status").innerText = "Stage_2: Place Black Block";
                document.getElementById("Stage_0").setAttribute("style","display:none;");
                document.getElementById("Stage_1").setAttribute("style","display:none;");
                document.getElementById("Stage_2").setAttribute("style","display:inline;");
                document.getElementById("Stage_3").setAttribute("style","display:none;");
                break;
            case 3:
                if(self.B1+self.B2+self.B3+self.B4 == 0){
                    alert("Please add a black block");
                    self.status--;
                    return;
                }
                document.getElementById("status").innerText = "Stage_3: Playing!";
                document.getElementById("Stage_0").setAttribute("style","display:none;");
                document.getElementById("Stage_1").setAttribute("style","display:none;");
                document.getElementById("Stage_2").setAttribute("style","display:none;");
                document.getElementById("Stage_3").setAttribute("style","display:inline;");
                break;
            case 4:
                //Judge after play
                document.getElementById("status").innerText = "Stage_4: Pending!";
                self.Pending(self);
                break;
            case 5:
                //Reinitialization after Judge
                let table = document.getElementById("tab");
                self.init(table);
                break;
        }
    },
    keyListen: function(event, self){
        // Different operations are carried out according to the stage. In the first stage, 
        // block is set, red block is set in the second stage, black block is set in the third stage, 
        // playing is carried out in the fourth stage, 
        // and reinitialization is carried out in the fifth stage
        switch(self.status){
            case 0:
                self.SetBlock(event,self);
                break;
            case 1:
                self.SetRed(event,self);
                break;
            case 2:
                self.SetBlack(event, self);
                break;
            case 3:
                self.awsd(event, self);
                break;
            case 4:
                self.Pending(self);
                break;
        }
    },
    Pending:function(self){
        //console.log(self);
        if(self.R1+self.R2+self.R3+self.R4 == 0){
            //The red block is emptied
            alert("You lost！");
            return;
        }
        if(self.B1+self.B2+self.B3+self.B4 == 0){
            //The black block is emptied
            alert("You win!");
            return;
        }
        alert("It ends in a draw!");
    },
    SetBlock: function(event, self){
        // Set block
        let target = event.target;
        let y = target.id.split("|")[0];
        let x = target.id.split("|")[1];
        if(this.board[y][x] != 0){
            //When the position is occupied or the type is not 'b', an error is reported
            alert("Illegal operation. This position is occupied.");
            return;
        }
        if(event.key != "b"){
            alert("Illegal operation. You should enter b.");
            return;
        }
        // Set the value of the corresponding position to 'b' in the position array, 
        // set the color of the block to blue, and display a white B word to indicate block.
        self.board[y][x] = 'b',
        target.setAttribute("style", "background-color:blue");
        target.firstChild.innerText = "B";
        target.firstChild.setAttribute("style", "color:white");
    },
    SetRed: function(event, self){
        //Set red block
        let target = event.target;
        let y = target.id.split("|")[0];
        let x = target.id.split("|")[1];
        //An error is reported when the character you typed is incorrect or the position is occupied
        if(this.board[y][x] != 0){
            alert("This position is occupied.");
            return;
        }
        if(event.key < '1' || event.key > '4'){
            alert("Please enter an integer between 1 and 4.");
            return;
        }
        self[`R${event.key}`]++;
        //Determine whether the blocks can be placed according to the rule of the number of blocks.
        if(event.key == 1 && self[`R${event.key}`] > 3){
            self[`R${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }else if((event.key == 2 || event.key == 3) && self[`R${event.key}`] > 2){
            self[`R${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }else if(event.key == 4 && self[`R${event.key}`] > 1){
            self[`R${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }
        if(self.R1+self.R2+self.R3+self.R4 > 8){
            self[`R${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }
        //Set the color of the block to red and display white numbers to represent the red block.
        self.board[y][x] = `R${event.key}`;
        target.setAttribute("style","background-color:red");
        target.firstChild.innerText = `${event.key}`;
        target.firstChild.setAttribute("style", "color:white");
    },
    SetBlack: function(event, self){
        //Same as red block setting
        let target = event.target;
        let y = target.id.split("|")[0];
        let x = target.id.split("|")[1];
        if(this.board[y][x] != 0){
            alert("This position is occupied.");
            return;
        }
        if(event.key < '1' || event.key > '4'){
            alert("Please enter an integer between 1 and 4.");
            return;
        }
        self[`B${event.key}`]++;
        if(event.key == 1 && self[`B${event.key}`] > 3){
            self[`B${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }else if((event.key == 2 || event.key == 3) && self[`B${event.key}`] > 2){
            self[`B${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }else if(event.key == 4 && self[`B${event.key}`] > 1){
            self[`B${event.key}`]--;
            alert("Maximum number of places exceeded");
            return;
        }
        if(self.B1+self.B2+self.B3+self.B4 > 8){
            self[`B${event.key}`]--;
            alert("Maximum number of places exceeded. Please click next.");
            return;
        }
        self.board[y][x] = `B${event.key}`;
        target.setAttribute("style","background-color:black");
        target.firstChild.innerText = `${event.key}`;
        target.firstChild.setAttribute("style", "color:white");
    },
    awsd: function(event, self){
        // Move red block
        let key = event.key;
        let target = event.target;
        let y = Number(target.id.split("|")[0]);
        let x = Number(target.id.split("|")[1]);
        // If the selected block is a non removable block or a black block, an error is reported
        if(self.board[y][x] == 0 || self.board[y][x] == 'b'){
            alert("Illegal operation");
            return;
        }
        if(self.board[y][x][0] == "B"){
            alert("Illegal operation");
            return;
        }
        switch(key){
            case 'a':
                if(x == 0 || self.board[y][x-1] == 'b'){
                    //If the moved position exceeds the boundary or is a non removable block, an error is reported
                    alert("Illegal operation");
                    return;
                }else{
                    if(self.board[y][x-1] == 0){
                        //Vacancy direct movement
                        let next = document.getElementById(`${y}|${x-1}`);
                        next.setAttribute("style","background-color:red");
                        next.firstChild.innerText = self.board[y][x][1];
                        next.firstChild.setAttribute("style","color:white");
                        target.removeAttribute("style");
                        target.firstChild.innerText = "",
                        target.firstChild.removeAttribute("style");
                        self.board[y][x-1] = self.board[y][x];
                        self.board[y][x] = 0;
                    }else{
                        //Determine whether red is eliminated or black is eliminated according to the rules
                        let bn = Number(self.board[y][x-1][1]);
                        let rn = Number(self.board[y][x][1]);
                        if(rn == 4 && bn == 1){
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }else if((rn != 1 && rn > bn) || (rn == 1 && bn == 4)){
                            let next = document.getElementById(`${y}|${x-1}`);
                            next.setAttribute("style","background-color:red");
                            next.firstChild.innerText = self.board[y][x][1];
                            next.firstChild.setAttribute("style","color:white");
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x-1] = self.board[y][x];
                            self.board[y][x] = 0;
                            self[`B${bn}`]--;
                        }else{
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }
                    }
                }
                break;
            case 'w':
                if(y == 0 || self.board[y-1][x] == 'b'){
                    alert("Illegal operation");
                    return;
                }else{
                    if(self.board[y-1][x] == 0){
                        let next = document.getElementById(`${y-1}|${x}`);
                        next.setAttribute("style","background-color:red");
                        next.firstChild.innerText = self.board[y][x][1];
                        next.firstChild.setAttribute("style","color:white");
                        target.removeAttribute("style");
                        target.firstChild.innerText = "",
                        target.firstChild.removeAttribute("style");
                        self.board[y-1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                    }else{
                        let bn = Number(self.board[y-1][x][1]);
                        let rn = Number(self.board[y][x][1]);
                        if(rn == 4 && bn == 1){
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }else if((rn != 1 && rn > bn) || (rn == 1 && bn == 4)){
                            let next = document.getElementById(`${y-1}|${x}`);
                            next.setAttribute("style","background-color:red");
                            next.firstChild.innerText = self.board[y][x][1];
                            next.firstChild.setAttribute("style","color:white");
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y-1][x] = self.board[y][x];
                            self.board[y][x] = 0;
                            self[`B${bn}`]--;
                        }else{
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }
                    }
                }
                break;
            case 's':
                if(y == self.y-1 || self.board[y+1][x] == 'b'){
                    alert("Illegal operation");
                    return;
                }else{
                    if(self.board[y+1][x] == 0){
                        let next = document.getElementById(`${y+1}|${x}`);
                        next.setAttribute("style","background-color:red");
                        next.firstChild.innerText = self.board[y][x][1];
                        next.firstChild.setAttribute("style","color:white");
                        target.removeAttribute("style");
                        target.firstChild.innerText = "",
                        target.firstChild.removeAttribute("style");
                        self.board[y+1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                    }else{
                        let bn = Number(self.board[y+1][x][1]);
                        let rn = Number(self.board[y][x][1]);
                        if(rn == 4 && bn == 1){
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }else if((rn != 1 && rn > bn) || (rn == 1 && bn == 4)){
                            let next = document.getElementById(`${y+1}|${x}`);
                            next.setAttribute("style","background-color:red");
                            next.firstChild.innerText = self.board[y][x][1];
                            next.firstChild.setAttribute("style","color:white");
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y+1][x] = self.board[y][x];
                            self.board[y][x] = 0;
                            self[`B${bn}`]--;
                        }else{
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }
                    }
                }
                break;
            case 'd':
                if(x == self.x-1 || self.board[y][x+1] == 'b'){
                    alert("Illegal operation");
                    return;
                }else{
                    if(self.board[y][x+1] == 0){
                        let next = document.getElementById(`${y}|${x+1}`);
                        next.setAttribute("style","background-color:red");
                        next.firstChild.innerText = self.board[y][x][1];
                        next.firstChild.setAttribute("style","color:white");
                        target.removeAttribute("style");
                        target.firstChild.innerText = "",
                        target.firstChild.removeAttribute("style");
                        self.board[y][x+1] = self.board[y][x];
                        self.board[y][x] = 0;
                    }else{
                        let bn = Number(self.board[y][x+1][1]);
                        let rn = Number(self.board[y][x][1]);
                        if(rn == 4 && bn == 1){
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }else if((rn != 1 && rn > bn) || (rn == 1 && bn == 4)){
                            let next = document.getElementById(`${y}|${x+1}`);
                            next.setAttribute("style","background-color:red");
                            next.firstChild.innerText = self.board[y][x][1];
                            next.firstChild.setAttribute("style","color:white");
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x+1] = self.board[y][x];
                            self.board[y][x] = 0;
                            self[`B${bn}`]--;
                        }else{
                            target.removeAttribute("style");
                            target.firstChild.innerText = "",
                            target.firstChild.removeAttribute("style");
                            self.board[y][x] = 0;
                            self[`R${rn}`]--;
                        }
                    }
                }
                break;
        }
        self.turn++; //Increase in rounds
        document.getElementById("turn").innerText = `This turn is ${self.turn}`;
        //Program move black block
        self.computerMove(self);
        document.getElementById("Red").innerText = `The number of red block is ${self.R1+self.R2+self.R3+self.R4}`;
        document.getElementById("Black").innerText = `The number of black block is ${self.B1+self.B2+self.B3+self.B4}`;
    },
    computerMove: function(self){
        //Find the location information of the red and black blocks
        let PositionR = [];
        let PositionB = [];
        for(let i = 0; i < self.y; i++){
            for(let j = 0; j < self.x; j++){
                if(self.board[i][j][0] == "R"){
                    PositionR.push(
                        {
                            num: Number(self.board[i][j][1]),
                            y: i,
                            x: j,
                        }
                    )
                }
                if(self.board[i][j][0] == "B"){
                    PositionB.push(
                        {
                            num: Number(self.board[i][j][1]),
                            y: i,
                            x: j,
                        }
                    )
                }
            }
        }
        // Calculate the shortest Manhattan distance between each black block and red block
        for(let i = 0; i < PositionB.length; i++){
            let length = 999;
            for(let j = 0; j < PositionR.length; j++){
                let dis = Math.abs(PositionB[i].x - PositionR[j].x)+Math.abs(PositionB[i].y - PositionR[j].x);
                if(dis < length){
                    length = dis;
                    PositionB[i].disx = PositionR[j].x;
                    PositionB[i].disy = PositionR[j].y;
                    PositionB[i].dis = dis;
                }
            }
        }

        let length = 999;
        let index = -1;

        let left = 1;
        let up = 1;
        let right = 1;
        let down = 1;
        // Find the black block that is closest to the red and can be moved according to the rules
        for(let i = 0; i < PositionB.length; i++){
            left = 1; up = 1; right = 1; down = 1;
            let x = PositionB[i].x;
            let y = PositionB[i].y;
            if(x == 0 || self.board[y][x-1] == 'b' || self.board[y][x-1][0] == 'B'){
                left = 0;
            }
            if(y == 0 || self.board[y-1][x] == 'b' || self.board[y-1][x][0] == 'B'){
                up = 0;
            }
            if(y == self.y-1 || self.board[y+1][x] == 'b' || self.board[y+1][x][0] == 'B'){
                down = 0;
            }
            if(x == self.x-1 || self.board[y][x+1] == 'b' || self.board[y][x+1][0] == 'B'){
                right = 0;
            }
            if(left == 0 && up == 0 && down == 0 && right == 0){
                continue;
            }
            if(PositionB[i].dis < length){
                index = i;
                length = PositionB[i].dis;
                PositionB[i].up = up;
                PositionB[i].down = down;
                PositionB[i].left = left;
                PositionB[i].right = right;
            }
        }
        //No movable block found, proceed to the next round
        if(index == -1 ){
            self.Pending(self);
            alert("Start the next round");
            return;
        }

        let x = PositionB[index].x;
        let y = PositionB[index].y;
        let disx = PositionB[index].disx;
        let disy = PositionB[index].disy;

        up = PositionB[index].up;
        down = PositionB[index].down;
        left = PositionB[index].left;
        right = PositionB[index].right;

        let flag = false; //False means to stay away, and true means to eliminate the red block

        //According to the rule decision principle or eliminate the red block
        let numb = Number(self.board[y][x][1]);
        let numr = Number(self.board[disy][disx][1]);
        if(numb == 4 && numr == 1){
            flag = false;
        }else{
            if(numb > numr){
                flag = true;
            }else{
                flag = false;
            }
        }

        if(flag){
            //If it is below the red block and can be moved up, move up
            if(y > disy && up){
                if(self.board[y-1][x][0] == 'R'){
                    self[self.board[y-1][x]]--;
                }
                self.board[y-1][x] = self.board[y][x];
                self.board[y][x] = 0;
                let next = document.getElementById(`${y-1}|${x}`);
                let target = document.getElementById(`${y}|${x}`);
                next.setAttribute("style", "background-color:black;");
                next.firstChild.innerText = target.firstChild.innerText;
                next.firstChild.setAttribute("style", "color:white;");
                target.removeAttribute("style");
                target.firstElementChild.removeAttribute("style");
                target.firstChild.innerText = "";
                return;
            }
            //If it is above the red block and can be moved down, move down
            if(y < disy && down){
                if(self.board[y+1][x][0] == 'R'){
                    self[self.board[y+1][x]]--;
                }
                self.board[y+1][x] = self.board[y][x];
                self.board[y][x] = 0;
                let next = document.getElementById(`${y+1}|${x}`);
                let target = document.getElementById(`${y}|${x}`);
                next.setAttribute("style", "background-color:black;");
                next.firstChild.innerText = target.firstChild.innerText;
                next.firstChild.setAttribute("style", "color:white;");
                target.removeAttribute("style");
                target.firstElementChild.removeAttribute("style");
                target.firstChild.innerText = "";
                return;
            }
            //If it moves on the left side of the red block and moves to the right, it moves to the right.
            if(x < disx && right){
                if(self.board[y][x+1][0] == 'R'){
                    self[self.board[y][x+1]]--;
                }
                self.board[y][x+1] = self.board[y][x];
                self.board[y][x] = 0;
                let next = document.getElementById(`${y}|${x+1}`);
                let target = document.getElementById(`${y}|${x}`);
                next.setAttribute("style", "background-color:black;");
                next.firstChild.innerText = target.firstChild.innerText;
                next.firstChild.setAttribute("style", "color:white;");
                target.removeAttribute("style");
                target.firstElementChild.removeAttribute("style");
                target.firstChild.innerText = "";
                return;
            }
            //If it is to the right of the red block and can be moved to the left, move to the left
            if(x > disx && left){
                if(self.board[y][x-1][0] == 'R'){
                    self[self.board[y][x-1]]--;
                }
                self.board[y][x-1] = self.board[y][x];
                self.board[y][x] = 0;
                let next = document.getElementById(`${y}|${x-1}`);
                let target = document.getElementById(`${y}|${x}`);
                next.setAttribute("style", "background-color:black;");
                next.firstChild.innerText = target.firstChild.innerText;
                next.firstChild.setAttribute("style", "color:white;");
                target.removeAttribute("style");
                target.firstElementChild.removeAttribute("style");
                target.firstChild.innerText = "";
                return;
            }
            //It does not meet the above conditions. If it can move upward, move upward, the same below
            if(up){
                if(self.board[y-1][x][0] == 'R'){
                    let numR = Number(self.board[y-1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y-1][x]]--;
                        self.board[y-1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y-1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y-1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y-1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(down){
                if(self.board[y+1][x][0] == 'R'){
                    let numR = Number(self.board[y+1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y+1][x]]--;
                        self.board[y+1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y+1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y+1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y+1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(left){
                if(self.board[y][x-1][0] == 'R'){
                    let numR = Number(self.board[y][x-1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x-1]]--;
                        self.board[y][x-1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x-1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x-1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x-1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(right){
                if(self.board[y][x+1][0] == 'R'){
                    let numR = Number(self.board[y][x+1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x+1]]--;
                        self.board[y][x+1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x+1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x+1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x+1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
        }else{
            //Opposite to clearing red blocks
            if(y < disy && up){
                if(self.board[y-1][x][0] == 'R'){
                    let numR = Number(self.board[y-1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y-1][x]]--;
                        self.board[y-1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y-1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y-1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y-1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(y > disy && down){
                if(self.board[y+1][x][0] == 'R'){
                    let numR = Number(self.board[y+1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y+1][x]]--;
                        self.board[y+1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y+1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y+1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y+1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(x > disx && right){
                if(self.board[y][x+1][0] == 'R'){
                    let numR = Number(self.board[y][x+1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x+1]]--;
                        self.board[y][x+1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x+1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x+1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x+1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(x < disx && left){
                if(self.board[y][x-1][0] == 'R'){
                    let numR = Number(self.board[y][x-1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x-1]]--;
                        self.board[y][x-1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x-1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x-1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x-1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            //It does not meet the above conditions. If it can move upward, move upward, the same below
            if(up){
                if(self.board[y-1][x][0] == 'R'){
                    let numR = Number(self.board[y-1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y-1][x]]--;
                        self.board[y-1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y-1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y-1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y-1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(down){
                if(self.board[y+1][x][0] == 'R'){
                    let numR = Number(self.board[y+1][x][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y+1][x]]--;
                        self.board[y+1][x] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y+1}|${x}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y+1][x] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y+1}|${x}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(left){
                if(self.board[y][x-1][0] == 'R'){
                    let numR = Number(self.board[y][x-1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x-1]]--;
                        self.board[y][x-1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x-1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x-1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x-1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
            if(right){
                if(self.board[y][x+1][0] == 'R'){
                    let numR = Number(self.board[y][x+1][1]);
                    if((numb == 4 && numR == 1) || numb <= numR){
                        self[self.board[y][x]]--;
                        self.board[y][x] = 0;
                        let target = document.getElementById(`${y}|${x}`);
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }else{
                        self[self.board[y][x+1]]--;
                        self.board[y][x+1] = self.board[y][x];
                        self.board[y][x] = 0;
                        let next = document.getElementById(`${y}|${x+1}`);
                        let target = document.getElementById(`${y}|${x}`);
                        next.setAttribute("style", "background-color:black;");
                        next.firstChild.innerText = target.firstChild.innerText;
                        next.firstChild.setAttribute("style", "color:white;");
                        target.removeAttribute("style");
                        target.firstElementChild.removeAttribute("style");
                        target.firstChild.innerText = "";
                    }
                }else{
                    self.board[y][x+1] = self.board[y][x];
                    self.board[y][x] = 0;
                    let next = document.getElementById(`${y}|${x+1}`);
                    let target = document.getElementById(`${y}|${x}`);
                    next.setAttribute("style", "background-color:black;");
                    next.firstChild.innerText = target.firstChild.innerText;
                    next.firstChild.setAttribute("style", "color:white;");
                    target.removeAttribute("style");
                    target.firstElementChild.removeAttribute("style");
                    target.firstChild.innerText = "";
                }
                return;
            }
        }



        // // 计算机移动
        // let PostionR = [];
        // let PostionB = [];
        // // 将坐标信息放入对应的表中
        // for(let i = 0; i < 5; i++){
        //     for(let j = 0; j < 5; j++){
        //         if(self.board[i][j][0] == "R"){
        //             PostionR.push(
        //                 {
        //                     num: Number(self.board[i][j][1]),
        //                     y: i,
        //                     x: j,
        //                 }
        //             )
        //         }
        //         if(self.board[i][j][0] == "B"){
        //             PostionB.push(
        //                 {
        //                     num: Number(self.board[i][j][1]),
        //                     y: i,
        //                     x: j,
        //                 }
        //             )
        //         }
        //     }
        // }
        // // 计算红色块与黑色块的最短距离，会被吃用dangerous表示，可以吃用eat表示
        // for(let i = 0; i < PostionB.length; i++){
        //     let dangerous = 999;
        //     let eat = 999;
        //     let postionAx;
        //     let postionAy;
        //     for(let j = 0; j < PostionR.length; j++){
        //         if((PostionB[i].num > PostionR[j].num) && (PostionB[i].num != 4 && PostionR[j].num != 1)){
        //             let tmpeat = Math.abs(PostionB[i].x - PostionR[j].x) + Math.abs(PostionB[i].y - PostionR[j].y);
        //             if(tmpeat < eat){
        //                 eat = tmpeat;
        //                 postionAx = PostionR[j].x;
        //                 postionAy = PostionR[j].y;
        //             }
        //         }else{
        //             let tmpdangerous = Math.abs(PostionB[i].x - PostionR[j].x) + Math.abs(PostionB[i].y - PostionR[j].y);
        //             if(dangerous > tmpdangerous){
        //                 dangerous = tmpdangerous;
        //                 postionAx = PostionR[j].x;
        //                 postionAy = PostionR[j].y;
        //             }
        //         }
        //     }
        //     if(eat < dangerous){
        //         PostionB[i].eat = eat;
        //         PostionB[i].Rx = postionAx;
        //         PostionB[i].Ry = postionAy;
        //     }else{
        //         PostionB[i].dangerous = dangerous;
        //         PostionB[i].Rx = postionAx;
        //         PostionB[i].Ry = postionAy;
        //     }
        // }
        // let dangerous = 999;
        // let eat = 999;
        // let indexd = 0;
        // let indexe = 0
        // // 确定最近的距离
        // for(let i = 0; i < PostionB.length; i++){
        //     if(PostionB[i].dangerous < dangerous){
        //         dangerous = PostionB[i].dangerous;
        //         indexd = i;
        //     }
        //     if(PostionB[i].eat < eat){
        //         eat = PostionB[i].eat;
        //         indexe = i;
        //     }
        // }
        // // 吃的距离比较近就进行吃，否者就逃
        // if(eat < dangerous){
        //     if(PostionB[indexe].x < PostionB[indexe].Rx && self.board[PostionB[indexe].y][PostionB[indexe].x+1] != 'b'){
        //         let x = PostionB[indexe].x;
        //         let y = PostionB[indexe].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y}|${x+1}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexe].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y][x+1][0] == 'R'){
        //             self[self.board[y][x+1]]--;
        //         }
        //         self.board[y][x+1] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexe].x > PostionB[indexe].Rx && self.board[PostionB[indexe].y][PostionB[indexe].x-1] != 'b'){
        //         let x = PostionB[indexe].x;
        //         let y = PostionB[indexe].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y}|${x-1}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexe].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y][x+1][0] == 'R'){
        //             self[self.board[y][x-1]]--;
        //         }
        //         self.board[y][x-1] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexe].y > PostionB[indexe].Ry && self.board[PostionB[indexe].y-1][PostionB[indexe].x] != 'b'){
        //         let x = PostionB[indexe].x;
        //         let y = PostionB[indexe].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y-1}|${x}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexe].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y-1][x][0] == 'R'){
        //             self[self.board[y-1][x]]--;
        //         }
        //         self.board[y-1][x] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexe].y < PostionB[indexe].Ry && self.board[PostionB[indexe].y+1][PostionB[indexe].x] != 'b'){
        //         let x = PostionB[indexe].x;
        //         let y = PostionB[indexe].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y+1}|${x}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexe].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y+1][x][0] == 'R'){
        //             self[self.board[y+1][x]]--;
        //         }
        //         self.board[y+1][x] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        // }else{
        //     if(PostionB[indexd].x < PostionB[indexd].Rx && self.board[PostionB[indexd].y][PostionB[indexd].x-1] != 'b' && PostionB[indexd].x != 0){
        //         let x = PostionB[indexd].x;
        //         let y = PostionB[indexd].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y}|${x-1}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexd].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y][x-1][0] == 'R'){
        //             self[self.board[y][x-1]]--;
        //         }
        //         self.board[y][x-1] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexd].x > PostionB[indexd].Rx && self.board[PostionB[indexd].y][PostionB[indexd].x+1] != 'b' && PostionB[indexd].x != 4){
        //         let x = PostionB[indexd].x;
        //         let y = PostionB[indexd].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y}|${x+1}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexd].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y][x+1][0] == 'R'){
        //             self[self.board[y][x+1]]--;
        //         }
        //         self.board[y][x+1] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexd].y < PostionB[indexd].Ry && self.board[PostionB[indexd].y-1][PostionB[indexd].x] != 'b' && PostionB[indexd].y != 0){
        //         let x = PostionB[indexd].x;
        //         let y = PostionB[indexd].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y-1}|${x}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexe].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y-1][x][0] == 'R'){
        //             self[self.board[y-1][x]]--;
        //         }
        //         self.board[y-1][x] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //     if(PostionB[indexd].y > PostionB[indexd].Ry && self.board[PostionB[indexd].y+1][PostionB[indexd].x] != 'b' && PostionB[indexd].y != 4){
        //         let x = PostionB[indexd].x;
        //         let y = PostionB[indexd].y;
        //         let target = document.getElementById(`${y}|${x}`);
        //         let next = document.getElementById(`${y+1}|${x}`);
        //         next.setAttribute("style","background-color:black");
        //         next.firstChild.innerText = PostionB[indexd].num;
        //         next.firstChild.setAttribute("style", "color:white");
        //         target.removeAttribute("style");
        //         target.firstChild.removeAttribute("style");
        //         target.firstChild.innerText = "";
        //         if(self.board[y+1][x][0] == 'R'){
        //             self[self.board[y+1][x]]--;
        //         }
        //         self.board[y+1][x] = self.board[y][x];
        //         self.board[y][x] = 0;
        //         return;
        //     }
        //  }
    }
    // keyListen: function(event,self){
    //     let target = event.target;
    //     let y = target.id.split("|")[0];
    //     let x = target.id.split("|")[1];
    //     if(this.board[y][x] != 0 || event.key != "b"){
    //         alert("非法操作，请重新操作");
    //         return;
    //     }
    //     let response =  window.prompt("请输入颜色类型:红色(R)、黑色(B)与数字(1~4),中间使用数字隔开").split(",");
    //     let color = response[0];
    //     let num = response[1]
    //     if(num < 1 || num > 4){
    //         alert("请输入1~4之间的整数");
    //         return;
    //     }
    //     self[`${color}${num}`]++;
    //     if(num == 1 && self[`${color}${num}`] > 3){
    //         self[`${color}${num}`]--;
    //         alert("超过最大放置个数");
    //         return;
    //     }else if((num == 2 || num == 3) && self[`${color}${num}`] > 2){
    //         self[`${color}${num}`]--;
    //         alert("超过最大放置个数");
    //         return;
    //     }else if(num == 4 && self[`${color}${num}`] > 1){
    //         self[`${color}${num}`]--;
    //         alert("超过最大放置个数");
    //         return;
    //     }
    //     self.board[y][x] = `${color}${num}`;
    //     if(color == "R"){
    //         target.setAttribute("style", "background-color:red");
    //     }else{
    //         target.setAttribute("style", "background-color:black");
    //     }
    //     target.firstChild.innerText = `${num}`;
    //     target.firstChild.setAttribute("style", "color:white");
    // }
}