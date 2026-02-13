window.onload=function(){
document.getElementById("donateTextDisplay").innerText=
localStorage.getItem("donateText")||"";

document.getElementById("donatePhoneDisplay").innerText=
localStorage.getItem("donatePhone")||"";
}

function updateDonateText(){
let val=document.getElementById("donateTextInput").value;
localStorage.setItem("donateText",val);
document.getElementById("donateTextDisplay").innerText=val;
}

function updateDonatePhone(){
let val=document.getElementById("donatePhoneInput").value;
localStorage.setItem("donatePhone",val);
document.getElementById("donatePhoneDisplay").innerText=val;
}
