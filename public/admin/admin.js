console.log("admin.js loaded");
document.getElementById("loginForm").addEventListener("submit",async function(e){

e.preventDefault();
console.log("Login button clicked");

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

const res=await fetch("/admin-login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username,

password

})

});

const data=await res.json();

if(data.success){

window.location.href="/admin/dashboard.html";

}else{

document.getElementById("message").innerHTML=data.message;

}

});