/* 


*/

const Sound = {
  bgm: new Audio("../../audio/background.mp3"),
  click: new Audio("../../audio/click.mp3"),
  start: new Audio("../../audio/game start.mp3"),
  bell: new Audio("../../audio/bell.mp3"),
  money: new Audio("../../audio/money.mp3"),
  put: new Audio("../../audio/put_item.mp3"),
  finish: new Audio("../../audio/finish.mp3"),
  swimming: new Audio("../../audio/swimming.mp3"),
  fall: new Audio("../../audio/fall.mp3"),
  error: new Audio("../../audio/error.mp3"),
  vip: new Audio("../../audio/vip.mp3"),
  init() {
      this.bgm.loop = true
  },

  play(name, time = null) {
    const audio = this[name]
    if (!audio) return

    audio.currentTime = 0
    audio.play()

    if (time !== null) {
        setTimeout(() => {
            audio.pause()
            audio.currentTime = 0;
        }, time)
    }
},
  stop(name) {
      this[name].pause()
      this[name].currentTime = 0

  }
}

class Trolley {
  constructor($trolley, capacity) {
    this.$trolley = $trolley
    this.capacity = capacity    
    this.items = new Array(capacity).fill(null)
  }

  hasSpace() {
    return this.items.includes(null)
  }

  hasGroup(groupName) {
    return this.items.some(item => item !== null && item.group === groupName);
  }

  hasItem(itemName) {
      return this.items.some(item => item && item.name === itemName);
    }

  add(item) {
    // only add to trolley array if there's space
    if (this.hasSpace()) {
      Sound.play("put")
      const index = this.items.indexOf(null)
      this.items[index] = item
      //console.log(`Added ${item.name} to trolley at slot ${index}`)
      this.updateUI(index, item, "add")
    }
  }

  /**
  * remove item from trolley based on criteria (name or group)
  * @param {Object} criteria -  { name: "food" } or { group: "supply" }
  */
  remove(criteria) {
    console.log("Attempting to remove item with criteria:", criteria)
    for (let i = 0; i < this.capacity; i++) {
        const item = this.items[i];
        if (!item) continue;

        const isMatch = (criteria.name && item.name === criteria.name) ||
                        (criteria.group && item.group === criteria.group);

        if (isMatch) {
          Sound.play("put")
          this.items[i] = null; 
          this.updateUI(i, item, "remove"); 
          return item;
        }
    }
    return null;
  }

  updateUI(index, item, action) {
    console.log(`Trolley ${action}:`, item, "at slot", index);``
    const $slot = $(`#slot_${index}`); 

    if (action === "add") {
      console.log(`Updating UI: Adding ${item.name} to slot ${index}`)
        const statusClass = "has" + item.name.charAt(0).toUpperCase() + item.name.slice(1);
        $slot.removeClass("empty hasFood hasTrash").addClass(statusClass);
        
    } else {
        $slot.removeClass("hasFood hasTrash").addClass("empty");
    }

  }

  clear($room){
    if(this.hasSpace()){
      const item = {
        name: "trash",
        group: "waste"
      }
      this.add(item)
      $room.attr("data-roomStatus", "available")
      $room.css("background-image", "url('../../img/room.svg')");
    }
}
}
//Init data
const speed = 200
const $cover = $("#cover")
const $coverContent = $("#coverContent")

const $playerGroup = $("#playerGroup")
const $trolley = $("#trolley")
const myTrolley = new Trolley($trolley, 2)

let guestInterval = null
let guestCount = 0
const MAX_GUESTS = parseInt($("#guestMax").text())
let $countGuest = $("#guestCount")
const guests_nor = Array.from({ length: 10 }, (v, i) => i + 1)
const guests_vip = Array.from({ length: 5 }, (v, i) => i + 91)
const guest_all = [...guests_nor, ...guests_vip]
let guest_leave = 0
//////////////////
/*
// 預想的資料結構
higest_info= {
  0:{"score":100,"star":"從結果頁返回的星星內文"},
  1:{"score":400,"star":"從結果頁返回的星星內文"}
}

*/
const level = parseInt($("#level").text())
// let higest_info  
// let now_info
// if (localStorage.getItem("higest_level_info") !== null){
//   // seted
//   higest_info =  localStorage.getItem("higest_level_info")
//   if (level in! (higest_info)) higest_info += {level:{"score":0, "star":""}}
//   else now_info ={level:{"score":0, "star":""}}
// } else {
//   // have not seted
//   higest_info = {level:{"score":0, "star":""}}
   
// }

let earn = 0
let score = 0
const $earn = $("#earn")
const $score = $("#score")
const $stateOfCharacter =$("#stateOfCharacter")
let hygienic = true

function addMoney(amount) {
  earn += amount
  $earn.text(earn)
  Sound.play("money")
  
  $stateOfCharacter.css("background-image", "url('../../img/getMoney.png')")
  setTimeout(() => {
        $stateOfCharacter.css("background-image", "none")
    }, 1000)
  
}

function change_score(amount, op = "add") {
  if(op === "add"){
    score += amount
    if(amount != 100){
    $stateOfCharacter.css("color","green").html(`+ ${amount}`);

    setTimeout(() => {
        $stateOfCharacter.html("")
    }, 1000)
    }

  }else if(op === "sub"){
    score -= amount
    $stateOfCharacter.css("color","red").html(`- ${amount}`);
    setTimeout(() => {
        $stateOfCharacter.html("");
    }, 1000);
  }
  $score.text(score)
}


$(document).ready(async function () {
  window.alreadyFinished = false
  localStorage.removeItem("earn")
  localStorage.removeItem("score")
  localStorage.removeItem("level")
  localStorage.removeItem("guestCount")
  localStorage.removeItem("previous")
  localStorage.removeItem("next")

  const currentPos = $playerGroup.offset()
  $playerGroup.css({
    "position": "absolute",
    "left": currentPos.left + "px",
    "top": currentPos.top + "px",
    "z-index": 99
  })
  await new Promise((resolve) => {
    $("#start").on("click", function () {
      Sound.play("swimming", 500);
      
      resolve(); 
    });
  })
  console.log("access level.js!")
  console.log(`speed: ${speed}`)

  await openingAnimation()
  console.log("..........")
  Sound.init()
  Sound.play("bgm")
  apperGuest()


})

// 3 -> 2 -> 1 -> go!
function openingAnimation() {
  return new Promise((resolve) => {
    let time = 3

    const timer = setInterval(() => {
      $coverContent.css("line-height", $cover.height()/2 + "px")
      $coverContent.text(time <= 0 ? "GO!" : time)
      Sound.play("start")

      $coverContent.removeClass("animate-pulse")
      void $coverContent[0].offsetWidth
      $coverContent.addClass("animate-pulse")

      if (time < 0) {
        clearInterval(timer)
        $cover.fadeOut(speed, () => {
          Sound.stop("start")
          resolve()
        })
      }

      time--
    }, 1000)
  })
}

async function finish() {
  if (window.alreadyFinished) return
  window.alreadyFinished = true
  Sound.stop("bgm")
  let pass = true
  if(score >= 100 * MAX_GUESTS) Sound.play("finish")
  else {
    Sound.play("fall")
    pass = false
  }

   await new Promise((resolve) => {
    let time = 2
    $cover.fadeIn(speed)
    
    $coverContent.text(pass? "Level Complete!":"Game Over.")
    const timer = setInterval(() => {
      
      $coverContent.removeClass("animate-pulse")
      $coverContent.addClass("animate-pulse")

      if (time < 0) {
        clearInterval(timer)
        $cover.fadeOut(speed, () => {
          resolve()
        })
      }
      time--
    }, 1000)
  })
  

  let totalSaving = parseInt(localStorage.getItem("totalSaving")) || 0;
  totalSaving += earn
  localStorage.setItem("totalSaving", totalSaving)

  
  localStorage.setItem("level", level)
  localStorage.setItem("earn", earn)
  localStorage.setItem("score", score)
  if(guest_leave){
    localStorage.setItem("guestCount", `${guestCount-guest_leave}/${guestCount}`)
  }else localStorage.setItem("guestCount", guestCount)
  
  localStorage.setItem("previous", `./level/${level}_level.html`)
  if (level<2)  localStorage.setItem("next", `./level/${level + 1}_level.html`)

  // spendtime
  window.location.href = "../done.html"
}

function apperGuest() {
  setTimeout(() => {
    spawnGuest()
    Sound.play("bell")

    guestInterval = setInterval(() => {
      if (guestCount < MAX_GUESTS) {
        spawnGuest()
        Sound.play("bell")
      } else {
        clearInterval(guestInterval)
      }
    }, 16000)
  }, 3000)
}

function spawnGuest() {
  if (guestCount >= MAX_GUESTS) return
  // const probability = Math.random()
  
  
  const randomGuest = guest_all[Math.floor(Math.random() * guest_all.length)]
  let type
  
  if (parseInt(randomGuest) > 90) {
    type = "vip"
    Sound.play("vip")
  }
  else type = "normal"
   
  const guestId = `guest_${Date.now()}`
  const guestObj = new Guest(guestId, type)
  
  const $guestElem = $(`
    
    <div id="${guestId}" 
    class="guest interact_area" data-floor="0">
    </div>`)
  
  $guestElem.css("background-image",`url("../../img/guest/${randomGuest}.png")`)
    
  $guestElem.data("guestObj", guestObj)
  $guestElem.data("isMoving", false)
  // $guestElem.data("startTime", Date.now())
  $("#waitting").append($guestElem)
  
  guestCount++
  $countGuest.text(guestCount)
  guestObj.timer()
}

class Guest {
  constructor(id, type) {
    this.id = id
    this.type = type
    this.room = null
    this.time = 0
    this.status = ""
    this.request = ""
    this.bonus = type === "vip" ? 20 : 0
  }
    
  timer() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        this.time++
        
        if (this.room) {
         clearInterval(timer)
         resolve()
         return
        }

        if (this.time === 15 && !(this.room)){
          change_score(30,"sub")
          $(`#${this.id}`).css({
            "border": "3px solid red",
            "transition": "all 0.5s"
          })
          console.log($(`#${this.id}`))
          
        }
        
        if (this.time >= 30 && !(this.room)){ 
          change_score(30,"sub")
          clearInterval(timer)
          this.leave()
          resolve()
        }
      }, 1000)
    })
  }
  
  leave() {
    guest_leave ++ 
    $(`#${this.id}`).fadeOut(0, function() {
      $(this).remove()
    })
    if(isFinish()) finish()
  }

  async startService() {
    const activity = [
      { name: "thinking", time: 2000},
      { name: "order",  request: "food"},
      { name: "eating", time: 10000 },
      { name: "checkout", request: "checkout" },
    ]
    
    for (let act of activity) {
      this.status = act.name
      this.request = act.request || ""
      this.room.css({ "background-image": `url('../../img/${act.name}.svg')` })
      if (act.time) {
        await new Promise(resolve => setTimeout(resolve, act.time))
      } else {
        const startTime = Date.now()

        await new Promise(resolve => {
          this.resolveService = resolve
        })

        const spentTime = Math.floor((Date.now() - startTime) / 1000)
        if (spentTime < 1) {
          change_score(80)
        } else if (spentTime < 3) {
          change_score(30)
        }
      }
    }
    console.log("測試測試測試----------")
    if (this.bonus) addMoney(this.bonus)
    this.room.css("background-image", "url('../../img/room.svg')");
  }

}

$(document).on("click", ".guest", function (e) {
  e.stopPropagation()
  const $this = $(this)
  console.log(`click guest ID: ${this.id}`)
  
  $(".room").removeClass("highlight-hint")

  const hasClass = $this.hasClass("selectedGuest")
  $(".guest").removeClass("selectedGuest")

  if (!hasClass) {
    $this.addClass("selectedGuest")
    $(".room[data-roomStatus='available']").addClass("highlight-hint")

  }
})

// Character movement
//// clike the room
$(".room").on("click", async function () {
  const $room = $(this)
  //console.log(`click ${$room[0].id}`)
  if ($(".selectedGuest").length) {
    $(".room").removeClass("highlight-hint")
    $room.attr("data-roomStatus", "active")
    const $selected = $(".selectedGuest")
    await guestToRoom($room, $selected)
  } else {
    Sound.play("click")

    await moveTo($room, $playerGroup)
    await serve($room)
  }
})
//// clike the interact_item
$(".interact_item").on("click", async function () {
  //console.log(`click ${$(this)[0].id}`)
  Sound.play("click")
  await moveTo($(this), $playerGroup)
  await interactWithGroundItem($(this))
})

async function guestToRoom($room, $guest) {
  if ($room.hasClass("available")){ 
    // 播放禁止的聲音
    return
  }
  Sound.play("click")
  Sound.play("swimming")
  $room.removeClass("available")
  $room.addClass("active")
  $guest.removeClass("selectedGuest")

  // let the guest can move
  const currentPos = $guest.offset()
  $guest.appendTo("#main").css({
    "position": "absolute",
    "left": currentPos.left + "px",
    "top": currentPos.top + "px",
    "z-index": 10000
  })

  try {
    await moveTo($room, $guest)
    Sound.stop("swimming")
    $guest.hide()

    const guestObj = $guest.data("guestObj")
    if (guestObj) {
      $room.data("guestObj", guestObj)
      guestObj.room = $room
      guestObj.startService()

    }

  } catch (error) {
    // e.g. moveTo is Rejected）
    //console.log("Move Cancel", error)
    $room.removeClass("active")
    $guest.addClass("selectedGuest")
  }
}

async function moveTo($destination, $character = $playerGroup) {

  if ($character.data("isMoving")) {
    return Promise.reject("Moving")
  }

  $character.data("isMoving", true)

  $(".interact_area").css("cursor", "not-allowed")
  $(".interact_item").css("cursor", "not-allowed")
  try {
    const currentFloor = $character.data("floor")
    const targetFloor = $destination.data("floor")

    if (currentFloor !== undefined && targetFloor !== undefined && currentFloor !== targetFloor) {
      await calculateAndMove($(`#lift_${currentFloor}`), $character, speed)

      // Forced disconnection of two paths
      $character.css("transition", "none")
      $character[0].offsetHeight
      await new Promise(r => setTimeout(r, 50))

      await calculateAndMove($(`#lift_${targetFloor}`), $character, speed)
      $character.data("floor", targetFloor)

    }

    await calculateAndMove($destination, $character, speed)

  } finally {
    $character.data("isMoving", false)
  }

  $(".interact_area").css("cursor", "default")
  $(".interact_item").css("cursor", "default")

}

function calculateAndMove($target, $character, speed = 500) {
  return new Promise((resolve) => {
    const areaPos = $target.position()
    const charPos = $character.position()

    const targetX = areaPos.left + ($target.outerWidth() / 2) - ($character.outerWidth() / 2)
    let targetY = areaPos.top + ($target.outerHeight() / 2) - $character.outerHeight() * 0.6

    if ($target.hasClass("interact_item")) {
      targetY = areaPos.top + ($target.outerHeight() / 2) - (1.5 * $character.outerHeight())
    }

    const deltaX = targetX - charPos.left
    const deltaY = targetY - charPos.top
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = Math.max(distance / speed, 0.1)

    function handleTransitionEnd(e) {
      // 確保只觸發一次，且是針對 left 或 top 的變化
      if (e.target === $character[0]) {
        $character.off("transitionend", handleTransitionEnd)
        resolve()
      }
    }

    // 5. 綁定監聽器
    $character.on("transitionend", handleTransitionEnd)

    // 6. 開始移動
    $character.css({
      "transition": `all ${duration}s linear`, // 先設 transition
      "left": targetX + "px",
      "top": targetY + "px"
    })

    // 安全備案：萬一瀏覽器沒觸發 transitionend (例如位移為0)，強制 resolve
    if (distance < 1) {
      $character.off("transitionend", handleTransitionEnd)
      resolve()
    }
  })
}

function interactWithGroundItem($item) {
  const itemType = getActionType($item)
  
  switch (itemType) {
    case "PICKUP":
      if (myTrolley.hasSpace()) {
        console.log($item.data("name"), $item.data("group"))
          const itemObj = {
          name: $item.data("name"),      
          group: $item.data("group") 
        }
        console.log("Picking up item:", itemObj)
        myTrolley.add(itemObj)
      } 
      break

    case "CLEAN":
      if (myTrolley.hasGroup("waste")) {
        myTrolley.remove({group: "waste"})
        if (!window.alreadyFinished && isFinish()) {
            finish(); 
        }
      }
      break

    case "RECYCLE":
      console.log("Attempting to recycle. Trolley has supply?", myTrolley.hasGroup("supply"))
      if (myTrolley.hasGroup("supply")) {
        myTrolley.remove({group: "supply"})
      }
      break

    default:
      console.log("Unknown item interaction")
  }
}

function isFinish() {
  if($("#waitting").find(".guest").length > 0){
    console.log("有客")
    return false
  } 
  if(myTrolley.hasGroup("waste")) return false
  
  if(($(".room[data-roomStatus='need-clean']").length || $(".room[data-roomStatus='active']").length)){
    return false
  }

  if(guestCount < MAX_GUESTS) {
    console.log("仲有人")
    return false}
  
  console.log("finished!")
  return true
}
function getActionType($item) {
    if ($item.hasClass("get")) return "PICKUP"
    if ($item.hasClass("rubbishbin")) return "CLEAN"
    if ($item.hasClass("recycle")) return "RECYCLE"
    return "UNKNOWN"
}

async function serve($room) {
  if($room.attr("data-roomStatus") === "need-clean"){
    myTrolley.clear($room)
    return
  }
  if(!$room.attr("data-roomStatus") === "active"){
    return 
  }

  const guestObj = $room.data("guestObj")
  console.log("Serving guest with request:", guestObj.request)
  switch (guestObj.request) {
    case "food":
      if (myTrolley.hasItem("food")) {
        if(myTrolley.hasGroup("waste")){
          hygienic = false
          change_score(30, "sub")
        }else{
          hygienic = true
        }

        myTrolley.remove({name: "food"})
        guestObj.resolveService()
      } 
      break

    case "checkout":
      let money = 100
      if(guestObj.bonus) money += 20
      if (guestObj.$element) {
        guestObj.$element.remove(); 
      }
      
      addMoney(money)
      change_score(100)
      $room.removeData("guestObj"); 
      $room.attr("data-roomStatus", "need-clean")
      $room.css("background-image", "url('../../img/needClean.svg')");

      myTrolley.clear($room)
      
      break;
  }
}


