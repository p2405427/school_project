/*
higest_level_info = {level:["score":score, "star":$star.html]}
*/

const $level = $("#level")
const $score = $("#score")
const $star = $("#star")

const $totalSaving = $("#totalSaving")
const $retry = $("#retry")
const $guestCount = $("#guestCount")
const $earn = $("#earn")
const $next = $("#next")
// const $time = $("#time")
//  in getItem("higest_level_info")
// // const higest_score = 
// const higest_level_info = parseInt(getItem("higest_level_info").score) || 0
const level = localStorage.getItem("level") 
const score = localStorage.getItem("score") 
const totalSaving = localStorage.getItem("totalSaving") 
const previous = localStorage.getItem("previous")
const next = localStorage.getItem("next")
const guestCount = localStorage.getItem("guestCount")
const earn = localStorage.getItem("earn")
// const time = localStorage.getItem("time")  

let guestnumber = parseInt(guestCount)
let starText = `<img src="../img/star.png" alt="star">`
let no_starText = `<img src="../img/no_star.png" alt="star">`
$level.text(level)
if(score >= (guestnumber + 1)*100 + 60){ 
    $star.html(starText.repeat(4))
    const $cover = $("#cover")
    const $main = $("#main")
    $cover.css("display","block")
    $main.css("display", "none")
    $("#getIt").on("click", function(){
        $cover.css("display","none")
        const Congratulations = new Audio("../../audio/universfield-level-passed-143039.mp3")
        Congratulations.play()
        $main.css("display", "block")
    })
}else if(score >= (guestnumber + 1)*100) $star.html(starText.repeat(3))
 else if(score >= guestnumber*100 + 30) $star.html(starText.repeat(2) + no_starText)
 else if(score >= guestnumber*100) $star.html(starText +no_starText.repeat(2))
 else {
    $star.html(no_starText.repeat(3))
    $(".role").attr("src","../img/fall_avatar.png")
    $next.attr("href", "../index.html")
    $next.html('<div class="button p_button done_button">Home 🏡</div></a>')

}
$score.text(score)

higest_level_info = {"level":level, "score":score, "star":$star.html}
// if 
// localStorage.setItem("level_star",)

$totalSaving.text(totalSaving)
$retry.attr("href", previous)
if(next) $next.attr("href", next)
else{
    $next.attr("href", "../index.html")
    $next.html('<div class="button p_button done_button">Home 🏡</div></a>')
}
$guestCount.text(guestCount)
$earn.text(earn)
// $time.text(time)