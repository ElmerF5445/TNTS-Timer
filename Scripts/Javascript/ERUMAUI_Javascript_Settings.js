var Settings_Data = {
    "Profile": {
        "Name": "Default_Dark"
    },
    "Data": {
        "Presets": {
            "Preset": "Settings_Presets_Dark"
        },
        "Backgrounds": {
            "Wallpaper": "https://elmerf5445.github.io/ERUMA-UI/Assets/Background/Wallpaper_Main.png",
            "Wallpaper_Enable": "Active",
            "Wallpaper_Blur": "Active",
            "Wallpaper_Darken": "Active",
            "ClockScreen": "https://elmerf5445.github.io/ERUMA-UI/Assets/Background/Wallpaper_Main.png",
            "ClockScreen_Enable": "Active"
        },
        "Effects": {
            "Blur": "Active",
            "Animations": "Active",
            "Transitions": "Active",
            "SmoothScrolling": "Active"
        }
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    Settings_Initialization();
});

function Settings_Initialization(){
    var Background_Wallpaper = document.createElement('span');
    Background_Wallpaper.setAttribute("class", "MainContent_Wallpaper");
    document.getElementById("MainContent_Container").appendChild(Background_Wallpaper);
    console.log("Settings is enabled");
    Settings_Key_Check();
}

function Settings_Initialization_Settings(){
    Settings_Key_Check();
    Settings_Load();
    Settings_Load_Values();
}

var Settings_Key = "ERUMAUI_Settings";
function Settings_Key_Check(){
    if (localStorage.getItem(Settings_Key) != null){
        console.log("Settings exists, loading values.");
        Settings_Data = JSON.parse(localStorage.getItem(Settings_Key));
        Settings_Load();
    } else {
        console.log("Settings doesn't exist, saving default values.");
        localStorage.setItem(Settings_Key, JSON.stringify(Settings_Data));
        window.location.reload();
    }
}

function Settings_Image_Check(Input_ID, Output_ID){
    var Input = document.getElementById(Input_ID);
    var Output = document.getElementById(Output_ID);
    Element_Attribute_Set(Output_ID, "Opacity", "Transparent");
    Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Button", "Clickability", "Disabled");
    setTimeout(function(){
        Output.src = Input.value;
        Output.onload = function(){
            Element_Attribute_Set(Output_ID, "Opacity", "Opaque");
            Element_Attribute_Remove("Settings_Backgrounds_Wallpaper_Button", "Clickability");
        };
        Output.onerror = function(){
            Element_Attribute_Set(Output_ID, "Opacity", "Invisible");
            Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Button", "Clickability", "Disabled");
        };
    }, 1000);
}

function Settings_Image_Changes_Commit(Input_ID, Consequence_1, Consequence_2){
    Element_Attribute_Set(Input_ID, "CommittedValue", document.getElementById(Input_ID).value);    
    Element_Attribute_Set(Consequence_1, "src", document.getElementById(Input_ID).value);
    Element_Attribute_Set(Consequence_2, "src", document.getElementById(Input_ID).value);
}

function Settings_Image_Changes_Cancel(Input_ID, Consequence_1, Consequence_2){  
    if (Element_Attribute_Get(Input_ID, "CommittedValue") != null){
        document.getElementById(Input_ID).value = Element_Attribute_Get(Input_ID, "CommittedValue"); 
        Element_Attribute_Set(Consequence_1, "src", Element_Attribute_Get(Input_ID, "CommittedValue"));
        Element_Attribute_Set(Consequence_2, "src", Element_Attribute_Get(Input_ID, "CommittedValue"));
    } else {
        document.getElementById(Input_ID).value = "";
        Element_Attribute_Set(Consequence_1, "src", "");
        Element_Attribute_Set(Consequence_2, "src", ""); 
    }
}

function Settings_Save(){
    // Presets
    Settings_Data.Data.Presets.Preset = Element_Attribute_Get("Settings_Presets", "Radio_ActiveButton");

    // Backgrounds
    Settings_Data.Data.Backgrounds.Wallpaper = Element_Attribute_Get("Settings_Backgrounds_Wallpaper_Input", "CommittedValue");
    Settings_Data.Data.Backgrounds.Wallpaper_Enable = Element_Attribute_Get("Settings_Backgrounds_Wallpaper_Enable", "State");
    Settings_Data.Data.Backgrounds.Wallpaper_Blur = Element_Attribute_Get("Settings_Backgrounds_Wallpaper_Blur", "State");
    Settings_Data.Data.Backgrounds.Wallpaper_Darken = Element_Attribute_Get("Settings_Backgrounds_Wallpaper_Darken", "State");
    Settings_Data.Data.Backgrounds.ClockScreen = Element_Attribute_Get("Settings_Backgrounds_ClockScreen_Input", "CommittedValue");
    Settings_Data.Data.Backgrounds.ClockScreen_Enable = Element_Attribute_Get("Settings_Backgrounds_ClockScreen_Enable", "State");
    
    // Effects
    Settings_Data.Data.Effects.Blur = Element_Attribute_Get("Settings_Effects_Blur", "State");
    Settings_Data.Data.Effects.Animations = Element_Attribute_Get("Settings_Effects_Animations", "State");
    Settings_Data.Data.Effects.Transitions = Element_Attribute_Get("Settings_Effects_Transitions", "State");
    Settings_Data.Data.Effects.SmoothScrolling = Element_Attribute_Get("Settings_Effects_SmoothScrolling", "State");

    Toasts_CreateToast("Assets/Icons/iconNew_save.png", "Settings saved", "Changes had been saved and applied.");
    localStorage.setItem(Settings_Key, JSON.stringify(Settings_Data));
    Settings_Load();
    Settings_Load_Values();
}

function Settings_Load(){
    var S = document.querySelector(':root');
    var B = document.getElementsByTagName("body")[0];
    // Presets
    if (Settings_Data.Data.Presets.Preset == "Settings_Presets_Dark"){
        document.getElementsByTagName("body")[0].setAttribute("Theme", "Dark");
    } else if (Settings_Data.Data.Presets.Preset == "Settings_Presets_Light") {
        document.getElementsByTagName("body")[0].setAttribute("Theme", "Light");
    }

    // Backgrounds
    if (Settings_Data.Data.Backgrounds.Wallpaper_Enable == "Active"){
        S.style.setProperty("--BG-Img-Wallpaper-Main", `url("${Settings_Data.Data.Backgrounds.Wallpaper}")`);
    } else {
        S.style.setProperty("--BG-Img-Wallpaper-Main", "unset");
    }
    if (Settings_Data.Data.Backgrounds.Wallpaper_Blur == "Active"){
        S.style.setProperty("--BG-Img-Wallpaper-Main-Blur", "20px");
    } else {
        S.style.setProperty("--BG-Img-Wallpaper-Main-Blur", "0px");
    }
    if (Settings_Data.Data.Backgrounds.Wallpaper_Darken == "Active"){
        S.style.setProperty("--BG-Img-Wallpaper-Main-Darken", "60%");
        S.style.setProperty("--BG-Img-Wallpaper-Main-Opacity", "60%");
    } else {
        S.style.setProperty("--BG-Img-Wallpaper-Main-Darken", "100%");
        S.style.setProperty("--BG-Img-Wallpaper-Main-Opacity", "100%");
    }
    if (Settings_Data.Data.Backgrounds.ClockScreen_Enable == "Active"){
        S.style.setProperty("--BG-Img-Wallpaper-Clock", `url("${Settings_Data.Data.Backgrounds.ClockScreen}")`);
    } else {
        S.style.setProperty("--BG-Img-Wallpaper-Clock", "unset");
    }

    // Effects
    if (Settings_Data.Data.Effects.Blur == "Active"){
        S.style.setProperty("--Element-BackdropBlur", "blur(10px)");
    } else {
        S.style.setProperty("--Element-BackdropBlur", "blur(0px)");
    }
    if (Settings_Data.Data.Effects.Animations == "Active"){
        document.body.setAttribute("Animations", "Enabled");
    } else {
        document.body.setAttribute("Animations", "Disabled");
    }
    if (Settings_Data.Data.Effects.Transitions == "Active"){
        document.body.setAttribute("Transitions", "Enabled");
    } else {
        document.body.setAttribute("Transitions", "Disabled");
    }
    if (Settings_Data.Data.Effects.SmoothScrolling == "Active"){
        document.body.setAttribute("SmoothScrolling", "Enabled");
    } else {
        document.body.setAttribute("SmoothScrolling", "Disabled");
    }

    var path = window.location.pathname;
    var App_CurrentPageName = path.split("/").pop();
    if (App_CurrentPageName == "ERUMAUI_Settings.html"){
        Settings_Load_Values();
    }
}

function Settings_Load_Values(){
    console.log("Loading values...");
    // Presets
    Element_Attribute_Set("Settings_Presets", "Radio_ActiveButton", Settings_Data.Data.Presets.Preset);
    Element_Attribute_Set(Settings_Data.Data.Presets.Preset, "State", "Active");

    // Backgrounds
    Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Blur", "State", Settings_Data.Data.Backgrounds.Wallpaper_Blur);
    Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Darken", "State", Settings_Data.Data.Backgrounds.Wallpaper_Darken);
    Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Enable", "State", Settings_Data.Data.Backgrounds.Wallpaper_Enable);
    Element_Attribute_Set("Settings_Backgrounds_ClockScreen_Enable", "State", Settings_Data.Data.Backgrounds.ClockScreen_Enable);

    document.getElementById("Settings_Backgrounds_Wallpaper_Input").value = Settings_Data.Data.Backgrounds.Wallpaper;
    Element_Attribute_Set("Settings_Backgrounds_Wallpaper_Input", "CommittedValue", Settings_Data.Data.Backgrounds.Wallpaper);
    document.getElementById("Settings_Backgrounds_Wallpaper_Output").src = Settings_Data.Data.Backgrounds.Wallpaper;
    document.getElementById("Settings_Backgrounds_Item_Preview_Image_Wallpaper").src = Settings_Data.Data.Backgrounds.Wallpaper;

    document.getElementById("Settings_Backgrounds_ClockScreen_Input").value = Settings_Data.Data.Backgrounds.ClockScreen;
    Element_Attribute_Set("Settings_Backgrounds_ClockScreen_Input", "CommittedValue", Settings_Data.Data.Backgrounds.ClockScreen);
    document.getElementById("Settings_Backgrounds_ClockScreen_Output").src = Settings_Data.Data.Backgrounds.ClockScreen;
    document.getElementById("Settings_Backgrounds_Item_Preview_Image_ClockScreen").src = Settings_Data.Data.Backgrounds.ClockScreen;
    
    

    // Effects
    Element_Attribute_Set("Settings_Effects_Blur", "State", Settings_Data.Data.Effects.Blur);
    Element_Attribute_Set("Settings_Effects_Animations", "State", Settings_Data.Data.Effects.Animations);
    Element_Attribute_Set("Settings_Effects_Transitions", "State", Settings_Data.Data.Effects.Transitions);
    Element_Attribute_Set("Settings_Effects_SmoothScrolling", "State", Settings_Data.Data.Effects.SmoothScrolling);
}

function Settings_Export(){
    if (document.getElementById('Settings_Export_FileName').value != null || document.getElementById('Settings_Export_FileName').value != ""){
        let Data = Settings_Data;
        var Data_JSON = JSON.stringify(Data, null, 2);
        const Data_Blob = new Blob([Data_JSON], {type: 'application/json'});
        saveAs(Data_Blob, document.getElementById('Settings_Export_FileName').value + ".cbe_eruma_s");
        Subwindows_Close('Settings_Export');
        Toasts_CreateToast("Assets/Icons/iconNew_download.png", "Settings  exported", "The file will be downloaded shortly.");
    } else {
        Subwindows_Open('AB_Editor_Error_Export_FileNameEmpty');
    }
}

function Settings_Import(){
    var File_Element = document.getElementById("Settings_Import_File");
    var File_Element_File = File_Element.files[0];
    const Reader = new FileReader();
    Reader.onload = function(e){
        const Contents = e.target.result;
        const Data_JSON = JSON.parse(Contents);
        Settings_Data = Data_JSON;
        Settings_Load_Values();
        Toasts_CreateToast("Assets/Icons/iconNew_download.png", "Settings imported", `Settings data successfully loaded. Click "Save Changes" to save the configuration.`);
    }

    Reader.readAsText(File_Element_File);
    Subwindows_Close("Settings_Import");
}