$(".p_button").on("click",  function () {
    const pageId = this.parentNode.parentNode.id
    const pageNumber = parseInt(pageId.split("_")[1])
    let showPage
    console.log(pageNumber)
    $(`#${pageId}`).removeClass("show")
    $(`#${pageId}`).addClass("hide")

    $(this).hasClass("previous")? showPage = pageNumber - 1 : showPage = pageNumber + 1
    const showPageId = "#page_" + showPage

    $(`${showPageId}`).removeClass("hide")
    $(`${showPageId}`).addClass("show")

})