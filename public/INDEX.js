const searchItem=document.querySelector('#search');
let cards=document.getElementById("cards");
// console.log(searchItem)

let searchVariable;

searchItem.addEventListener("input",(e)=>{
    searchItem.value=e.target.value;
    // console.log(searchItem.value)
    searchItem.value=searchItem.value.toLowerCase();
    // searchVariable=searchVariable.toLowerCase();
    let m="";
    document.getElementById("book-list").innerHTML=null;
    searchVariable.forEach(book=>{
        // console.log(book.title)
        // console.log(book.authors)
        let title=book.title.toLowerCase();
        let author=book.authors.toLowerCase();
        
        if (title.includes(searchItem.value)||author.includes(searchItem.value)){
                m+=`<article id= "cards">
                 <div class="text">
                     <a href=${book.url+"pdf/"}><img src=${book.image}></a>
                 </div>
            </article>`
            //  console.log(book.url);
              
        }
    })
    // console.log(m)
    document.getElementById("book-list").innerHTML=m;

})

// console.log("code running!");
fetch("https://www.dbooks.org/api/recent").then((response)=>{
    // console.log(response);
    return response.json();
})
.then((data)=>{
    let d='';
    searchVariable=data.books
    data.books.forEach(book => {
        d+=`<article id= "cards">
        
         <div class="text">
             <a href=${book.url+"pdf/"}><img src=${book.image}></a>
         </div>
    </article>`
    //  console.log(book.url);
      document.getElementById("book-list").innerHTML=d;
        
    });
})
.catch((err)=>{
    console.log("something went wrong!!!!!   ",err)

}
)