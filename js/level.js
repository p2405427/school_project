/* 
加入以下類別
character: 角色
interact_area: 可交互區域
interact_item: 可拾取物件

加入以下類別：
data-floor = 0, 1, 2
*/
//

// clike the room
$(".room").on("click", function() {
  if($(".selcetedGuest").length){
    guestToRoom($(this))
  }else{
    moveTo($(this))
  }
})

// clike the interact_item
$(".interact_item").on("click", function(){
  sameFloor($("mainCharacter"), $(this))
  moveTo($(this))
  trolleyOP($(this))
})

function guestToRoom($room){
  if(!$room.data("active")){
  let $guest = $("selectedGuest")
  sameFloor($guest, $room)
  let roomOff = room.Offset()
  $guest.css{
    left: (roomOff.left + $room.outerWidth/2) + "px"
    top: (roomOff.top + $room.outerHeight/2) + "px"
    } 
}

function moveTo(($area, $character = $("#maincharacter)){
  let areaOff = $area.offset()
  let left, top           
  
  if (area.hasClass("interact_area")){
    left = areaOff.left + $area.outerWidth/2 - $character.outerWidth()/2
    top = areaOff.top + $area.outerHeight - $character.outerHeight() // same bottom
  }else if(area.hasClass("interact_item")){
    left = areaOff.left + $area.outerWidth/2 - $character.outerWidth()/2
    top = areaOff.top + $area.outerHeight/2 - $character.outerHeight()/2
  }  

  $character.css({
    left: left + "px"
    top: top + "px"
    transition: 'left 0.2s, top 0.2s'//////////
  })
}

function sameFloor(character, elme){
  let FC = character.data("floor")
  let FE = elme.data("floor")
  if (FC !== FE){
    moveTo($(`#left_${FC}`), $character)
    setTimeout(()=>{
      moveTo($(`#left_${FE}`), $character)  
    },200)// 0.2s->200 ms
    
  }
}




