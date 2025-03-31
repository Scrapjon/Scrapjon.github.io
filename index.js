
window.addEventListener("load",(async ()=>{
    fetch('./logs.json').then(async(data)=>{
        if (data.ok){
            //console.log(data.json())
            var logs = await data.json();
            console.log(logs)
            dirCont = document.getElementById("directorycontainer")
            logs.forEach(log => {
                divWrapper = document.createElement("div")
                dirElement = document.createTextNode(log.title)
                divWrapper.appendChild(dirElement)
                dirCont.appendChild(divWrapper)
                

            });
        }
    }); 
    
}))
