

const PIXEL_URL = "https://pixels-war.oie-lab.net"

const MAP_ID = "TEST"

document.addEventListener("DOMContentLoaded", () => {

    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`

    
    
    document.getElementById("baseurl").value = PIXEL_URL
    document.getElementById("mapid").value = MAP_ID
    document.getElementById("baseurl").readOnly = true
    document.getElementById("mapid").readOnly = true

    fetch(`${PREFIX}/preinit`, {credentials: "include"})
        .then((response) => response.json())
        .then((json) => {
            
            let key = json.key
            fetch(PREFIX+'/init?key='+key, {credentials: "include"})
                .then((response) => response.json())
                .then((json) => {
                    let id = json.id;
                    let nx = json.nx;
                    let ny = json.ny;
                    let data = json.data;
                    
                    document.getElementById("grid").style.gridTemplateColumns = `repeat(${nx}, 20px)`;
                    document.getElementById("grid").style.gridTemplateRows = `repeat(${ny}, 20px)`;
                    for (let i = 0; i < nx; i++) {
                        for (let j = 0; j < ny; j++) {
                            element = document.createElement("div");
                            element.id = `${i}-${j}`;
                            element.addEventListener("click", (e) => changemementColor(id,e,i,j));
                            element.style.backgroundColor = `rgb(${data[i][j][0]}, ${data[i][j][1]}, ${data[i][j][2]})`;
                            document.getElementById("grid").appendChild(element);}}
                    document.getElementById("refresh").addEventListener("click", () => {refresh(id);});
                    setInterval(refresh(id), 3000)
    
                })

            

        })

    
    
    function changemementColor (user_id,e,x,y){
        const [r, g, b] = getPickedColorInRGB()
        fetch(PREFIX+'/set/'+user_id.toString()+'/'+x+'/'+y+'/'+r.toString()+'/'+g.toString()+'/'+b.toString(), {credentials: "include"})
                .then((response) => response.json())
                
    }

    function refresh(user_id) {
        fetch(`${PREFIX}/deltas?id=${user_id}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                let deltas = json.deltas;
                
                for (const pixcol of deltas) {
                    const pixel = document.getElementById(pixcol[0].toString()+"-"+pixcol[1].toString());
                    pixel.style.backgroundColor = `rgb(${pixcol[2]}, ${pixcol[3]}, ${pixcol[4]})`;
                }
        

            })
    }

    // fonction qui permet de récupérer la couleur en rgb du pixel cliqué
    function getPickedColorInRGB() {
        const colorHexa = document.getElementById("colorpicker").value

        const r = parseInt(colorHexa.substring(1, 3), 16)
        const g = parseInt(colorHexa.substring(3, 5), 16)
        const b = parseInt(colorHexa.substring(5, 7), 16)

        return [r, g, b]
    }

    
    

})