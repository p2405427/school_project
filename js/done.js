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
 in getItem("higest_level_info")
// const higest_score = 
const higest_level_info = parseInt(getItem("higest_level_info").score) || 0
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
if(score >= (guestnumber + 1)*100 + 60) $star.html(starText.repeat(4))
else if(score >= (guestnumber + 1)*100) $star.html(starText.repeat(3))
else if(score >= guestnumber*100 + 30) $star.html(starText.repeat(2) + no_starText)
else if(score >= guestnumber*100) $star.html(starText +no_starText.repeat(2))
$score.text(score)

higest_level_info = {"level":level, "score":score, "star":$star.html}
// if 
// localStorage.setItem("level_star",)

$totalSaving.text(totalSaving)
$retry.attr("href", previous)
$next.attr("href", next)
$guestCount.text(guestCount)
$earn.text(earn)
// $time.text(time)