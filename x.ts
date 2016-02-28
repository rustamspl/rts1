
var p= new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(2425352)
    },1000);
});

p.then((d)=>{
    console.log(d);
});