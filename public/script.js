const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



// function toggle() {
//     // var blur = document.getElementById('blur');
//     // blur.classList.toggle('active')
    
//     var popup = document.getElementById('popup');
//     popup.classList.toggle('active')
// }
function toggleforget() {
    // var blur = document.getElementById('blur');
    // blur.classList.toggle('active')
    
    var popup1 = document.getElementById('popup1');
    popup1.classList.toggle('active')
}