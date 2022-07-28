function Login(){ 
    var done=0; 
    var usuario=document.login.usuario.value; 
    var password=document.login.password.value; 
    if (usuario=="compra" && password=="compra123") { 
    window.location="compra.html"; 
    } 
    if (usuario=="USUARIO2" && password=="CONTRASEÑA2") { 
    window.location="error.html"; 
    } 
    if (usuario=="" && password=="") { 
    window.location="errorpopup.html"; 
    } 
    } 
    

    document.oncontextmenu = function(){return false} 

 