function timeout(ms){
    return new Promise(resolve =>{
        setTimeout(() => resolve(), ms)
    })
}

async function run(){
    let attempts = 0;
    while (attempts < 3) {
        console.log("ran")
        await new Promise(resolve =>{
            setTimeout(() => resolve(), 1000)
        })
        attempts++;
    }
    console.log("finished")
}

run()