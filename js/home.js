const $totalSaving = $("#totalSaving")
const totalSaving = localStorage.getItem("totalSaving") 
if (totalSaving) {
    $totalSaving.text(totalSaving)
}else {
    $totalSaving.text(0)
}

$("#reset").on("click", function(){
    const result = confirm("Reset will delete all data.\nAre you sure?")

    if (result == true) {
        localStorage.clear()
        alert("Data successfully deleted!");
    }
})
