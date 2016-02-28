var p = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2425352);
    }, 1000);
});
p.then(function (d) {
    console.log(d);
});

function q(){
    
}

console.log(typeof(p));
console.log(p instanceof Promise);
console.log(typeof(q));
