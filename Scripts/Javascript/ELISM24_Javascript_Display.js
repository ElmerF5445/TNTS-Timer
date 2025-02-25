function ELISM_Test(){
    Toasts_CreateToast('Assets/Icons/iconNew_edit.png', 'Switched to Edit mode.', 'Clicking elements will open its corresponding edit window.');
}

window.addEventListener("message", (event) => {
    const {action, value1} = event.data;
    if (action == "TEST"){
        ELISM_Test();
    }
    if (action == "RESET_TIMER"){
        ELISM_Timer_Reset(value1);
    }
    if (action == "START_TIMER"){
        ELISM_Timer_Start();
    }
    if (action == "STOP_TIMER"){
        ELISM_Timer_Stop();
    }
    if (action == "TOGGLE_TIMER_STATE"){
        ELISM_Timer_State_Toggle();
    }
    if (action == "UPDATE_WORD_DISPLAY_TEXT"){
        ELISM_Word_Update(value1);
    }
    if (action == "VIOLATION"){
        ELISM_Violation_Add(value1);
    }
    if (action == "TOGGLE_SCREEN_STATE"){
        ELISM_Screen_Toggle();
        
    }
    if (action == "RULE_ALLOWOVERTIME_UPDATE"){
        ELISM_Timer_Rule_AllowOvertime_Update(value1);
    }
    if (action == "SLIDE_SWITCH"){
        ELISM_Slides_Switch(value1)
    }
    if (action == "SCREEN_SWITCH"){
        ELISM_Screen_Switch(value1)
    }
    if (action == "UPDATE_QUESTION_DISPLAY_TEXT"){
        Element_InnerHTML_Set("ELISM24_Question_Text", value1);
    }
    if (action == "EDIT_CSS_BANNER"){
        ELISM_CSS_Edit("Screen_Banner", value1);
    }
    if (action == "EDIT_CSS_QUESTION"){
        ELISM_CSS_Edit("Screen_Question", value1);
    }
    if (action == "EDIT_CSS_TIMER"){
        ELISM_CSS_Edit("Screen_Timer", value1);
    }
    if (action == "EDIT_CSS_SLIDES"){
        ELISM_CSS_Edit("Screen_Slides", value1);
    }
    if (action == "EDIT_CSS_CLOCK"){
        ELISM_CSS_Edit("Screen_Clock", value1);
    }
    if (action == "BUZZER"){
        ELISM_Timer_Buzzer();
    }
});

function ELISM_Command_Broadcast(action, value1){
    if (window.opener != null){
        window.opener.postMessage({action: action, value1: value1}, "*");
    }
}

var Timer_Seconds = 180;
function ELISM_Timer_Reset(StartingTime){
    Timer_Seconds = StartingTime;
    Timer_Running_Seconds = 0;
    ELISM_Timer_Time_Render();
    Timer_Overtime_Informed = false;
}

function ELISM_Timer_Time_Render(){
    document.getElementById("ELISM24_Timer_Time_Text").innerHTML = ELISM_Timer_Time_Format();
}

function ELISM_Timer_Time_Format(){
    const absSeconds = Math.abs(Timer_Seconds);
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = absSeconds % 60;
    if (Timer_Seconds >= 0){
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else if (Timer_Seconds < 0){
        return `-${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
}

let Timer_Interval;
var Timer_Running_Seconds = 0;
var Timer_Rule_AllowOvertime = true;
var Timer_State = "paused";

function ELISM_Timer_Start(){
    if (Timer_Interval == null){
        Timer_Interval = setInterval(() => {
            Timer_Seconds--;
            Timer_Running_Seconds++;
            Timer_State = "running"
            ELISM_Timer_Time_Render();
            ELISM_Timer_Phases_Update();
            ELISM_Command_Broadcast("UPDATE_TIMER_STATE", "running");
            if (Timer_Seconds <= 0){
                if(Timer_Rule_AllowOvertime == false){
                    ELISM_Timer_Stop();
                } else {
                    ELISM_Timer_Overtime();
                }
                if (Timer_Seconds == -15){
                    ELISM_Timer_Buzzer();
                }
            }
            ELISM_Command_Broadcast("UPDATE_TIMER", Timer_Seconds);
            ELISM_Command_Broadcast("UPDATE_TIMER_RUNNING", Timer_Running_Seconds);
        }, 1000);
    }
}

function ELISM_Timer_Buzzer(){
    Sound_Buzzer.play();
}

function ELISM_Timer_Stop(){
    clearInterval(Timer_Interval);
    Timer_Interval = null;
    ELISM_Timer_Time_Render();
    ELISM_Command_Broadcast("UPDATE_TIMER", Timer_Seconds);
    ELISM_Command_Broadcast("UPDATE_TIMER_STATE", "paused");
    Timer_State = "paused"
    ELISM_Timer_Phases_Update();
}

var Timer_Overtime_Informed = false;
function ELISM_Timer_Overtime(){
    if (Timer_Overtime_Informed == false){
        Timer_Overtime_Informed = true;
        Element_Attribute_Set("ELISM24_Timer_Time", "Overtime", "");
    }
}

function ELISM_Timer_Phases_Update(){
    if (Timer_State == "running") {
        if (Timer_Seconds > 30){
            Element_Attribute_Set("ELISM24_Timer", "Phase", "Green");
            Element_Attribute_Set("ELISM24_Timer_Phase_Red", "State", "Inactive");
            Element_Attribute_Set("ELISM24_Timer_Phase_Yellow", "State", "Inactive");
            Element_Attribute_Set("ELISM24_Timer_Phase_Green", "State", "Active");
        }
        if (Timer_Seconds <= 30){
            Element_Attribute_Set("ELISM24_Timer", "Phase", "Yellow");
            Element_Attribute_Set("ELISM24_Timer_Phase_Red", "State", "Inactive");
            Element_Attribute_Set("ELISM24_Timer_Phase_Yellow", "State", "Active");
            Element_Attribute_Set("ELISM24_Timer_Phase_Green", "State", "Inactive");
        }
        if (Timer_Seconds <= 0){
            Element_Attribute_Set("ELISM24_Timer", "Phase", "Red");
            Element_Attribute_Set("ELISM24_Timer_Phase_Red", "State", "Active");
            Element_Attribute_Set("ELISM24_Timer_Phase_Yellow", "State", "Inactive");
            Element_Attribute_Set("ELISM24_Timer_Phase_Green", "State", "Inactive");
        }
    } else {
        Element_Attribute_Set("ELISM24_Timer", "Phase", "Standby");
        Element_Attribute_Set("ELISM24_Timer_Phase_Red", "State", "Standby");
        Element_Attribute_Set("ELISM24_Timer_Phase_Yellow", "State", "Standby");
        Element_Attribute_Set("ELISM24_Timer_Phase_Green", "State", "Standby");
    }
    
}

function ELISM_Timer_State_Toggle(){
    if (Element_Attribute_Get("ELISM24_Timer", "State") == "Timer"){
        Element_Attribute_Set("ELISM24_Timer", "State", "WithWord");
    } else if (Element_Attribute_Get("ELISM24_Timer", "State") == "WithWord"){
        Element_Attribute_Set("ELISM24_Timer", "State", "Timer");
    }
    ELISM_Command_Broadcast("UPDATE_WORD_DISPLAY_STATE", Element_Attribute_Get("ELISM24_Timer", "State"));
}

function ELISM_Word_Update(Word){
    Element_Attribute_Set("ELISM24_Timer", "State", "Timer");
    setTimeout(function(){
        Element_Attribute_Set("ELISM24_Timer", "State", "WithWord");
        document.getElementById("ELISM24_Timer_Word_Text").innerHTML = Word;
        ELISM_Command_Broadcast("UPDATE_WORD_DISPLAY", Word);
    }, 500);
}

function ELISM_Violation_Add(Addition){
    Timer_Running_Seconds = Timer_Running_Seconds + Addition;
    Timer_Seconds = Timer_Seconds - Addition;
    ELISM_Timer_Time_Render();
    Element_Attribute_Set("ELISM24_Timer", "Shake", "None");
    setTimeout(function(){
        Element_Attribute_Set("ELISM24_Timer", "Shake", "Shake");
    }, 50);
    
}


function ELISM_Timer_Rule_AllowOvertime_Update(State){
    Timer_Rule_AllowOvertime = State;
}

var Particle_Count = 0;
function Particle_Create(Container_Target, Source, Class, State_Start, State_End){
    var Particle = document.createElement('img');
    Particle.setAttribute("class", "Particle " + Class);
    Particle.setAttribute("src", Source);
    Particle.setAttribute("style", State_Start);
    Particle.setAttribute("draggable", "false");
    Particle.setAttribute("loading", "lazy");
    Particle_Count++;
    Particle.setAttribute("id", "Particle_" + Particle_Count);
    document.getElementById(Container_Target).appendChild(Particle);
    // setTimeout(function(){
    //     document.getElementById("Particle_" + Particle_Count).setAttribute("style", State_End);
    // }, 500);
    // setTimeout(function(){
    //     document.getElementById(Container_Target).removeChild("Particle_" + Particle_Count);
    // }, 10000);
    setTimeout(() => {
        Particle.style = State_End;
    }, 10);

    // setTimeout(() => {
    //     document.getElementById(Container_Target).removeChild(Particle);
    // }, 20000);
}

function ELISM_Decoration_Particle_Clear(){
    document.getElementById("ELISM_Decorations").innerHTML = "";
}

function Randomize(){
    var Number = Math.ceil((Math.random() * 100));
    if (Math.random() >= 0.50){
        Number *= -1
    } else {
        Number *= 1
    }
    return Number;
}

function ELISM_Decoration_Particle_Generate(){
    var Container = document.getElementById("MainContent");
    var Container_Client_Height = Container.clientHeight;
    var Container_Client_Width = Container.clientWidth;
    for(a = 0; a <= 50; a++){
        var OffsetX = Math.round((Randomize() * 10));
        var OffsetY = Math.abs(Math.round((Randomize() * 12) + (Container_Client_Height + Randomize() + 450)));
        var State_Start = `left: ${OffsetX}px; top: ${OffsetY}px; animation-delay: ${Math.abs(Randomize() / 100) * 2}s`;
        Particle_Create("ELISM_Decorations", "Assets/Images/Particle_1.png", "ELISM_Sparkle_Decoration_Twinkling", `${State_Start}`, `${State_Start}`);
    }
    for(a = 0; a <= 20; a++){
        var OffsetX = Math.round((Randomize() * 10));
        var OffsetY = Math.abs(Math.round((Randomize() * 12) + (Container_Client_Height + Randomize() + 450)));
        var State_Start = `transform: scale(0.05); left: ${OffsetX}px; top: ${OffsetY}px; animation-delay: ${Math.abs(Randomize() / 100) * 2}s`;
        Particle_Create("ELISM_Decorations", "Assets/Images/Particle_2.png", "ELISM_Sparkle_Decoration_Twinkling", `${State_Start}`, `${State_Start}`);
    }
    for(a = 0; a <= 20; a++){
        var OffsetX = Math.round((Randomize() * 10));
        var OffsetY = Math.abs(Math.round((Randomize() * 12) + (Container_Client_Height + Randomize() + 450)));
        var State_Start = `transform: scale(0.07); left: ${OffsetX}px; top: ${OffsetY}px`;
        Particle_Create("ELISM_Decorations", "Assets/Images/Particle_3.png", "ELISM_Sparkle_Decoration", `${State_Start}`, `${State_Start}`);
    }
    for(a = 0; a <= 20; a++){
        var OffsetX = Math.round((Randomize() * 10));
        var OffsetY = Math.abs(Math.round((Randomize() * 12) + (Container_Client_Height + Randomize() + 450)));
        var State_Start = `transform: scale(0.07); left: ${OffsetX}px; top: ${OffsetY}px`;
        Particle_Create("ELISM_Decorations", "Assets/Images/Particle_4.png", "ELISM_Sparkle_Decoration", `${State_Start}`, `${State_Start}`);
    }
    // for(a = 0; a <= 50; a++){
    //     var OffsetX = Math.round(Randomize() * 10);
    //     var OffsetY = Math.round(Randomize() * 10);
    //     var State_Start = `transform: scale(0.0) translate(0px, 0px);`;
    //     var State_End = `transform: scale(0.8) translate(${OffsetX + 200}%, ${OffsetY + 200}%);`;
    //     Particle_Create("ELISM_Banner", "Assets/Images/ELISM24/Particle_2.png", "ELISM_Sparkle", `${State_Start}`, `${State_End}`);
    // }
}

var Sound_Buzzer;
// Generate slides
window.addEventListener("DOMContentLoaded", function(){
    Sound_Buzzer = new Audio("Assets/Sounds/Buzzer.mp3");
});
window.addEventListener("DOMContentLoaded", ELISM_Slides_Generate);
function ELISM_Slides_Generate(){
    // var Slides_Links = [
    //     "https://elmerf5445.github.io/TNTS-Timer/Assets/Images/Slide_1.png",
    //     "https://elmerf5445.github.io/TNTS-Timer/Assets/Images/Slide_2.png",
    //     "https://elmerf5445.github.io/TNTS-Timer/Assets/Images/Slide_3.png",
    //     "https://elmerf5445.github.io/TNTS-Timer/Assets/Images/Slide_4.png",
    //     "https://elmerf5445.github.io/TNTS-Timer/Assets/Images/Slide_5.png"
    // ];
    var Slides_Links = [
        "Assets/Images/Slide_1.png",
        "Assets/Images/Slide_2.png",
        "Assets/Images/Slide_3.png",
        "Assets/Images/Slide_4.png",
        "Assets/Images/Slide_5.png",
        "Assets/Images/Slide_6.png",
        "Assets/Images/Slide_7.png"
    ];
    var Slides = Slides_Links
    Element_Clear("ELISM24_Slides");
    for (a = 0; a < Slides.length; a++){
        var Slide_Item = Element_Create('img');
        Slide_Item.setAttribute("src", Slides[a]);
        Slide_Item.setAttribute("class", "ELISM24_Slides_Slide");
        Slide_Item.setAttribute("id", `ELISM24_Slides_Slide_${a + 1}`);
        Slide_Item.setAttribute("State", "Inactive");
        Element_Append("ELISM24_Slides", Slide_Item);
    }
}

function ELISM_Slides_Switch(Slide){
    var Slide_List = Element_Get_ByQuery_All(".ELISM24_Slides_Slide");
    for (a = 0; a < Slide_List.length; a++){
        Element_Attribute_Set(`ELISM24_Slides_Slide_${a + 1}`, "State", "Inactive");   
    }
    Element_Attribute_Set(`ELISM24_Slides_Slide_${Slide}`, "State", "Active");   
}

var Screen_State = "Banner";
function ELISM_Screen_Toggle(){
    if (Screen_State == "Timer"){
        Screen_State = "Banner";
        Element_Attribute_Set("ELISM_Decorations", "State", "Active");
    } else {
        Screen_State = "Timer";
        Element_Attribute_Set("ELISM_Decorations", "State", "Inactive");
    }
    ELISM_Command_Broadcast('UPDATE_BANNER_DISPLAY_STATE', Element_Attribute_Get("ELISM_Decorations", "State"));
}

function ELISM_Screen_Switch(Screen){
    Element_Attribute_Set("ELISM24_Decorations", "Display_State", "Inactive");
    Element_Attribute_Set("ELISM24_Question", "Display_State", "Inactive");
    Element_Attribute_Set("ELISM24_Timer", "Display_State", "Inactive");
    Element_Attribute_Set("ELISM24_Slides", "Display_State", "Inactive");    
    Element_Attribute_Set("ELISM24_Clock_Overlay", "Display_State", "Inactive");    
    if (Screen == "Banner"){
        Element_Attribute_Set("ELISM24_Decorations", "Display_State", "Active");
    } else if (Screen == "Question"){
        Element_Attribute_Set("ELISM24_Question", "Display_State", "Active");
    } else if (Screen == "Timer"){
        Element_Attribute_Set("ELISM24_Timer", "Display_State", "Active");
    } else if (Screen == "Slides"){
        Element_Attribute_Set("ELISM24_Slides", "Display_State", "Active");
    } else if (Screen == "Clock"){
        Element_Attribute_Set("ELISM24_Clock_Overlay", "Display_State", "Active");
    }
    ELISM_Command_Broadcast('UPDATE_ACTIVE_SCREEN', Screen);
}

function ELISM_CSS_Edit(Type, Value){
    switch (Type){
        case "Screen_Banner":
            Element_Attribute_Set("ELISM24_Decorations", "style", Value);
            break;
        case "Screen_Question":
            Element_Attribute_Set("ELISM24_Question", "style", Value);
            break;
        case "Screen_Timer":
            Element_Attribute_Set("ELISM24_Timer", "style", Value);
            break;
        case "Screen_Slides":
            Element_Attribute_Set("ELISM24_Slides", "style", Value);
            break;
        case "Screen_Clock":
            Element_Attribute_Set("ELISM24_Clock_Overlay", "style", Value);
            break;
    }
}