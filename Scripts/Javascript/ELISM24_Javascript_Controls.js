var Display;
function ELISM_Display_Open(){
    Display = window.open("Pages/ELISM24_Display.html", "timerWindow", "width=1280,height=720");
}

function ELISM_Command_Broadcast(action, value1){
    if (Display != null){
        Display.postMessage({action: action, value1: value1}, "*");
    } else {
        Toasts_CreateToast('Assets/Icons/icon_error.png', 'Command not broadcast', 'The display window is either closed or had been disconnected. Click "Open display window" to reconnect.');
    }
}

window.addEventListener("message", (event) => {
    const {action, value1} = event.data;
    if (action == "UPDATE_TIMER"){
        ELISM_Timer_Time_Render(value1);
    }
    if (action == "UPDATE_TIMER_RUNNING"){
        ELISM_Timer_Time_Running_Render(value1);
    }
    if (action == "UPDATE_WORD_DISPLAY_STATE"){
        if (value1 == "WithWord"){
            document.getElementById("ELISM24_Controls_Values_WordDisplayState").innerHTML = "Word is <b><u>displayed</b></u>"
        } else {
            document.getElementById("ELISM24_Controls_Values_WordDisplayState").innerHTML = "Word is <b><u>hidden</b></u>"
        }
    }
    if (action == "UPDATE_WORD_DISPLAY"){
        document.getElementById("ELISM24_Controls_Info_Word").innerHTML = value1;
        Word_ToGuess = value1;
    }
    if (action == "UPDATE_TIMER_STATE"){
        document.getElementById("ELISM24_Controls_Output_Timer_State").innerHTML = `Timer is <b><u>${value1}</b></u>`;
    }
    if (action == "UPDATE_BANNER_DISPLAY_STATE"){
        if (value1 == "Active"){
            document.getElementById("ELISM24_Controls_Values_BannerDisplayState").innerHTML = "Banner is <b><u>displayed</b></u>"
        } else {
            document.getElementById("ELISM24_Controls_Values_BannerDisplayState").innerHTML = "Banner is <b><u>hidden</b></u>"
        }
    }
});

var Word_ToGuess = "";
var Timer_Seconds = 120;
var Timer_Running_Seconds = 0;
function ELISM_Timer_Time_Render(Seconds){
    Timer_Seconds = Seconds; 
    document.getElementById("ELISM24_Controls_Info_Time").innerHTML = ELISM_Timer_Time_Format();
}

function ELISM_Timer_Time_Running_Render(Seconds){
    Timer_Running_Seconds = Seconds; 
    const minutes = Math.floor(Timer_Running_Seconds / 60);
    const remainingSeconds = Timer_Running_Seconds % 60;
    document.getElementById("ELISM24_Controls_Info_Time_Running").innerHTML = `/ ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')} / Violations: ${Violation_Count}`;
}

function ELISM_Timer_Time_Format(){
    const minutes = Math.floor(Timer_Seconds / 60);
    const remainingSeconds = Timer_Seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

var Team = "";
function ELISM_Team_Update(){
    Team = document.getElementById("ELISM24_Controls_Values_Input_Team").value;
    document.getElementById("ELISM24_Controls_Info_Team").innerHTML = Team;
}

var Timer_StartingTime = 120;
function ELISM_Timer_StartingTime_Update(){
    Timer_StartingTime = document.getElementById("ELISM24_Controls_Values_Input_StartingTime").value;
}

function ELISM_Timer_StartingTime_Preview(){
    var Timer_Preview = document.getElementById("ELISM24_Controls_Values_Input_StartingTime").value;
    const minutes = Math.floor(Timer_Preview / 60);
    const remainingSeconds = Timer_Preview % 60;
    document.getElementById("ELISM24_Controls_Values_Output_StartingTime").innerHTML = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function ELISM_Timer_Reset(){
    ELISM_Command_Broadcast('RESET_TIMER', Timer_StartingTime);
}

var Timer_Violation_Time = 3;
function ELISM_Timer_ViolationTime_Update(){
    Timer_Violation_Time = document.getElementById("ELISM24_Controls_Values_Input_ViolationTime").value;
}

var Violation_Count = 0;
function ELISM_Violations_Update(){
    ELISM_Command_Broadcast('VIOLATION', Timer_Violation_Time);
    Violation_Count++;
}

// var ELISM_Records = [
//     {
//         Team: "",
//         Word: "",
//         Time_Remaining: "",
//         Time_Running: "",
//         Violations: ""
//     }
// ];
var ELISM_Records = [];

window.addEventListener("DOMContentLoaded", () => {
    ELISM_Records_Load();
})

function ELISM_Records_Load(){
    if (localStorage.getItem("ELISM_Records") != null){
        ELISM_Records = JSON.parse(localStorage.getItem("ELISM_Records"));
        ELISM_Records_Render();
    } else {
        localStorage.setItem("ELISM_Records", JSON.stringify(ELISM_Records));
        ELISM_Records_Load();
    }
}

function ELISM_Records_Render(){
    document.getElementById("ELISM24_Records_List").innerHTML = "";
    for(a = 0; a < ELISM_Records.length; a++){
        var Data = ELISM_Records[a];
        var ELISM_Records_Item_InnerHTML = `
            <p class="ELISM24_Records_List_Item_Text">
                ${Data.Team}
            </p>
            <p class="ELISM24_Records_List_Item_Text">
                ${Data.Word}
            </p>
            <p class="ELISM24_Records_List_Item_Text">
                ${ELISM_Translate_Time(Data.Time_Remaining)}
            </p>
            <p class="ELISM24_Records_List_Item_Text">
                ${ELISM_Translate_Time(Data.Time_Running)}
            </p>
            <p class="ELISM24_Records_List_Item_Text">
                ${Data.Violations}
            </p>
            <button class="General_Button ELISM24_Records_List_Item_Delete" onclick="ELISM_Records_Delete(${a})">
                <img src="Assets/Icons/iconNew_delete.png" alt=""/>
            </button>
        `;
        var ELISM_Records_Item = document.createElement('div');
        ELISM_Records_Item.innerHTML = ELISM_Records_Item_InnerHTML;
        ELISM_Records_Item.setAttribute("class", "ELISM24_Records_List_Item");
        document.getElementById("ELISM24_Records_List").appendChild(ELISM_Records_Item);
    }
}

function ELISM_Records_Add(){
    let Data = {
        Team: Team,
        Word: Word_ToGuess,
        Time_Remaining: Timer_Seconds,
        Time_Running: Timer_Running_Seconds,
        Violations: Violation_Count
    }
    ELISM_Records.push(Data);
    localStorage.setItem("ELISM_Records", JSON.stringify(ELISM_Records));
    ELISM_Records_Load();
}

function ELISM_Records_Delete(Index){
    ELISM_Records.splice(Index, 1);
    localStorage.setItem("ELISM_Records", JSON.stringify(ELISM_Records));
    ELISM_Records_Load();
}

function ELISM_Translate_Time(Seconds){
    const minutes = Math.floor(Seconds / 60);
    const remainingSeconds = Seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function ELISM_Screen_Toggle(){
    ELISM_Command_Broadcast('TOGGLE_SCREEN_STATE');
}