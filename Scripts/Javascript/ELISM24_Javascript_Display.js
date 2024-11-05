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
});

function ELISM_Command_Broadcast(action, value1){
    if (window.opener != null){
        window.opener.postMessage({action: action, value1: value1}, "*");
    }
}

var Timer_Seconds = 120;
function ELISM_Timer_Reset(StartingTime){
    Timer_Seconds = StartingTime;
    Timer_Running_Seconds = 0;
    ELISM_Timer_Time_Render();
}

function ELISM_Timer_Time_Render(){
    document.getElementById("ELISM24_Timer_Time_Text").innerHTML = ELISM_Timer_Time_Format();
}

function ELISM_Timer_Time_Format(){
    const minutes = Math.floor(Timer_Seconds / 60);
    const remainingSeconds = Timer_Seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

let Timer_Interval;
var Timer_Running_Seconds = 0;

function ELISM_Timer_Start(){
    if (Timer_Interval == null){
        Timer_Interval = setInterval(() => {
            Timer_Seconds--;
            Timer_Running_Seconds++;
            if (Timer_Seconds > 0){
                ELISM_Timer_Time_Render();
                ELISM_Command_Broadcast("UPDATE_TIMER_STATE", "running");
            } else {
                ELISM_Timer_Stop();
            }
            ELISM_Command_Broadcast("UPDATE_TIMER", Timer_Seconds);
            ELISM_Command_Broadcast("UPDATE_TIMER_RUNNING", Timer_Running_Seconds);
        }, 1000);
    }
}

function ELISM_Timer_Stop(){
    clearInterval(Timer_Interval);
    Timer_Interval = null;
    ELISM_Timer_Time_Render();
    ELISM_Command_Broadcast("UPDATE_TIMER", Timer_Seconds);
    ELISM_Command_Broadcast("UPDATE_TIMER_STATE", "paused");
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

var Screen_State = "Timer";
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