/* 
加入以下類別
character: 角色
interact_area: 可交互區域
interact_item: 可拾取物件

加入以下類別：
data-floor = 0, 1, 2
*/
//
const speed = 400
console.log("access level.js!")
console.log(`speed: ${speed}`)
$("#mainCharacterandTrolley").css({
    "left":"300px",
    "bottom":"250px"
})

// clike the room
$(".room").on("click", function() {
  console.log(`click ${ $(this)[0].id }`)
  if($(".selcetedGuest").length){
    guestToRoom($(this))
  }else{
    moveTo($(this), $("#mainCharacter"))
  }
})

// clike the interact_item
$(".interact_item").on("click", function(){
  console.log(`click ${ $(this)[0].id }`)
  moveTo($(this),$("#mainCharacter"))
  //trolleyOP($(this))
})

function guestToRoom($room){
  
  if(!$room.data("active")){
  let $guest = $(".selectedGuest")
  
}
}
function calculateAndMove($target, $character, speed = 500) {
  return new Promise((resolve) => {
    
    const areaOff = $target.offset();
    const charOff = $character.offset();

    // 1. 取得目標座標 (統一腳底對齊)
    const targetX = areaOff.left + $target.outerWidth() / 2 - $character.outerWidth() / 2;
    let targetY = areaOff.top + $target.outerHeight()/2 - $character.outerHeight();

    const deltaX = targetX - charOff.left;
    const deltaY = targetY - charOff.top;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const duration = Math.max(distance / speed, 0.1);

    if($target.hasClass("interact_item")){
      console.log("interact_item set y")
      targetY = areaOff.top + $target.outerHeight()/2 - 2*$character.outerHeight();
    }
    $character.css({
      left: targetX + "px",
      top: targetY +  "px",
      transition: `all ${duration}s linear`
    });

    setTimeout(resolve, duration * 1000);
  });
}

async function moveTo($destination, $character = $("#mainCharacter")) {
  const currentFloor = $character.data("floor");
  const targetFloor = $destination.data("floor");


  if (currentFloor !== undefined && targetFloor !== undefined && currentFloor !== targetFloor) {
  
    await calculateAndMove($(`#lift_${currentFloor}`), $character, speed);
    await calculateAndMove($(`#lift_${targetFloor}`), $character, speed);
    
    $character.data("floor", targetFloor);
    
  }


  await calculateAndMove($destination, $character, speed);
  
}





