

console.log("code running!");
fetch("https://www.dbooks.org/api/recent").then((response)=>{
    // console.log(response);
    return response.json();
})
.then((data)=>{
    let d='';

    data.books.forEach(book => {
        d+=`<article id= "cards">
        <img src=${book.image}>
         <div class="text">
             <button><a href=${book.url+"pdf/"}>read book..</a></button>
         </div>
    </article>`
     console.log(book.url);
      document.getElementById("cards").innerHTML=d;
        
    });
})
.catch((err)=>{
    console.log("something went wrong!!!!!   ",err)

}
)