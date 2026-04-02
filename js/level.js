/* 
加入以下類別
character: 角色
interact_area: 可交互區域
interact_item: 可拾取物件

加入以下類別：
data-floor = 0, 1, 2
*/
//
const speed = 200
const Cover = $("#cover")
const coverContent = $("#coverContent")
let isMoving = false

let guestInterval = null
let guestCount = 0
const MAX_GUESTS = parseInt($("#guestMax").text())
let Count_guest = $("#guestCount")
console.log(Count_guest)//0


class Guest{
  constructor(id){
    this.id = id
  }
}
const MainCharacter = $("#mainCharacter")

$(document).ready(async function() {
    MainCharacter.css({
        "left": "10%",
        "bottom": "15%",
        "transition": "none"
    })
    const currentPos = MainCharacter.offset();
    MainCharacter.css({
        "position": "absolute",
        "left": currentPos.left + "px",
        "top": currentPos.top + "px",
        "z-index": 99 
    });
    
    console.log("access level.js!")
    console.log(`speed: ${speed}`)

    await openingAnimation()
    console.log("..........")
    startGuestSpawner()

})

function openingAnimation() {
    return new Promise((resolve) => {
    let time = 3 

    const timer = setInterval(() => {
      coverContent.text(time <= 0 ? "GO!" : time)

      coverContent.removeClass("animate-pulse")
      void coverContent[0].offsetWidth 
      coverContent.addClass("animate-pulse")

      if (time < 0) {
        clearInterval(timer);
        Cover.fadeOut(speed, () => {
          resolve(); 
        });
      }

        time--
    }, 1000)
  })
}


function startGuestSpawner() {
  setTimeout(() => {
    spawnGuest()
    
    guestInterval = setInterval(() => {
      if (guestCount < MAX_GUESTS) {
        spawnGuest()
      } else {
        clearInterval(guestInterval)
      }
    }, 16000)
  }, 3000)
}

function spawnGuest() {
  if (guestCount >= MAX_GUESTS) return
  
  const guestId = `guest_${Date.now()}` 
  new Guest(guestId)
  const $guest = $(`
    <div id="${guestId}" class="guest interact_area" data-floor="0">🧑</div>
  `)
  
  $("#waitting").append($guest)
  
  $guest.on("click", function(e) {
    e.stopPropagation()
    console.log(`click ${$(guestId)}`)
    if($(this).hasClass("selectedGuest")){
      $(".guest").removeClass("selectedGuest");
    }
    else if($(".selectedGuest").length){
      $(".guest").removeClass("selectedGuest")
      $(this).addClass("selectedGuest")
    }else{
      $(this).addClass("selectedGuest")
    }

  })
  
  guestCount++
  Count_guest.text(guestCount);
}



// clike the room
$(".room").on("click", function() {
  console.log(`click ${ $(this)[0].id }`)
  if($(".selectedGuest").length){
    if($(this).hasClass("active")){
      return
    }
    const $selected = $(".selectedGuest");
    const currentPos = $selected.offset();
    $selected.appendTo("#main").css({
        "position": "absolute",
        "left": currentPos.left + "px",
        "top": currentPos.top + "px",
        "z-index": 10000
    });
    moveTo($(this), $selected)
    
    
    
  }else{
    moveTo($(this), MainCharacter)
  }
})



// clike the interact_item
$(".interact_item").on("click", function(){
  console.log(`click ${ $(this)[0].id }`)
  moveTo($(this),MainCharacter)
  //trolleyOP($(this))
})

async function moveTo($destination, $character = MainCharacter) {
  
  if (isMoving) return;

  isMoving = true;
  $(".interact_area").css("cursor", "not-allowed");
  $(".interact_item").css("cursor", "not-allowed");
  
  const currentFloor = $character.data("floor")
  const targetFloor = $destination.data("floor")
  

  if (currentFloor !== undefined && targetFloor !== undefined && currentFloor !== targetFloor) {
  
    await calculateAndMove($(`#lift_${currentFloor}`), $character, speed)
    await calculateAndMove($(`#lift_${targetFloor}`), $character, speed)
    
    $character.data("floor", targetFloor)
    
  }


  await calculateAndMove($destination, $character, speed)
  isMoving = false;
  $(".interact_area").css("cursor", "default");
  $(".interact_item").css("cursor", "default");
  if($character.hasClass("selectedGuest")){
    $character.css({
      "display": "none",
      "transition": "filter 2s ease"
    })
    $destination.addClass("active")
    $character.removeClass("selectedGuest")
  }
  
}


function calculateAndMove($target, $character, speed = 500) {
  return new Promise((resolve) => {
    $character.css("transition", "none");

    const areaPos = $target.position();
    const charPos = $character.position();

    const targetX = areaPos.left + ($target.outerWidth() / 2) - ($character.outerWidth() / 2);
    let targetY = areaPos.top + ($target.outerHeight() / 2) - $character.outerHeight()*0.6;

    if ($target.hasClass("interact_item")) {
      console.log("interact_item set y");
      targetY = areaPos.top + ($target.outerHeight() / 2) - (1.5 * $character.outerHeight());
    }

    const deltaX = targetX - charPos.left;
    const deltaY = targetY - charPos.top;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Math.max(distance / speed, 0.1);

    $character.css({
      left: targetX + "px",
      top: targetY + "px", 
      transition: `all ${duration}s linear`
    });

    setTimeout(resolve, duration * 1000);
  });
}







