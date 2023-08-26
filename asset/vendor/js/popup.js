const btn = document.querySelectorAll(".btn-popup");
const model = document.querySelectorAll(".modal");
const modal_close = document.querySelectorAll(".modal-close-btn");


btn.forEach((e, i) => {
        e.addEventListener("click", function() {
            model[i].classList.add("popup");
        })
});

modal_close.forEach((e, i) => {
    e.addEventListener("click", function() {
        model[i].classList.remove("popup");
    })
})