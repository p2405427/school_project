const $totalSaving = $("#totalSaving")
const totalSaving = localStorage.getItem("totalSaving") 
if (totalSaving) {
    $totalSaving.text(totalSaving)
}else {
    $totalSaving.text(0)
}