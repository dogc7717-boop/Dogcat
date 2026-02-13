function increment(type){
let count = localStorage.getItem(type) || 0;
count++;
localStorage.setItem(type,count);
document.getElementById(type+"Count").innerText=count;
}

function resetAll(){
['subhan','hamd','akbar'].forEach(t=>{
localStorage.setItem(t,0);
document.getElementById(t+"Count").innerText=0;
});
}

function changeBtnText(type,text){
localStorage.setItem(type+"Text",text);
document.getElementById(type+"Btn").innerText=text;
}

window.onload=function(){
['subhan','hamd','akbar'].forEach(t=>{
document.getElementById(t+"Count").innerText=localStorage.getItem(t)||0;
let savedText=localStorage.getItem(t+"Text");
if(savedText) document.getElementById(t+"Btn").innerText=savedText;
});
  }
