/* 
加入以下類別
character: 角色
interact_area: 可交互區域
interact_item: 可拾取物件
*/
//
constant mainCharacterRec = main.getboundingclientrect();



// clike the room
$(".room").on("click", function() {
  if($(".selcetedGuest")){
    GuestToRoom($(this))
  }else{
    moveTo($(this))
  }
})

// clike the interact_item
$(".interact_item").on("click", function(){
  sameFloor(mainCharacter, $(this))
  moveTo($(this))
  trolleyOP($(this))
})

function GuestToRoom(room){
  if(not room.attr("active")){
  sameFloor($(".selcetedGuest"), room)
  $(".selcetedGuest").x = (room.right-room.left)/2+"px"
  $(".selcetedGuest").y = room.bottom + "px"
}

function moveTo(character = maincharacter, area){
  if (area is $(".interact_area")){
    character.x = (area.right-area.left)/2+"px"
    character.y = area.bottom + "px"
  }elif(area is $(".interact_item")){
    ////////////////////////////////////////////
    character.x = (area.right-area.left)/2+"px"
    character.y = (area.bottom-area.top)/2+"px"
  }
  
}

function sameFloor(character, elme){
  FC = character.attr(floor)
  FE = elme.attr(floor)
  if (FC )
}




