// Pass_port ver 0.4
// AFter Effects script that imports your render passes
// and builds full beauty composition (forthcoming feature)
// (c) 2020-2022 Keerah, keerah.com. All rights reserved. 

(function Pass_port(thisObj) {

    var Pass_port = new Object;
        Pass_port.scriptName = "Pass.port";
        Pass_port.version = "0.4";
        Pass_port.AOVtag = (getSettings("AOVtag") != null) ? getSettings("AOVtag") : "_AOV_";
        Pass_port.FPS = (getSettings("frameRate") != null) ? getSettings("frameRate") : 30;
        Pass_port.lastRules = (getSettings("lastRules") != null) ? getSettings("lastRules") : 0;
        Pass_port.lastPath = (getSettings("lastPath") != null) ? getSettings("lastPath") : null;
        Pass_port.autoComp = (getSettings("autoComp") != null) ? getSettings("autoComp") : true;
        Pass_port.autoComp = (getSettings("straightA") != null) ? getSettings("straightA") : true;
        Pass_port.homeFolderName = (getSettings("homeFolderName") != null) ? getSettings("homeFolderName") : "Pass.Port ";
        Pass_port.logFile = (getSettings("logFile") != null) ? getSettings("logFile") : "pass.port_log.txt";
        Pass_port.logFile = (app.project.file != null) ? app.project.file.path + "\\" + Pass_port.logFile : Folder.desktop.fsName + "\\" + Pass_port.logFile;

    var passType = ["Standard Shading AOV",
                    "Raw Shading AOV",
                    "Utility AOV",
                    "Deprecated AOV"];

    var ruleNames = ["Redshift C4D",
                    "Redshift Houdini",
                    "Octane C4D",
                    "Octane Houdini"]

    if (Pass_port.lastRules >= ruleNames.length) Pass_port.lastRules = 0;

    var sequenceData = [];
    var passList = getRules(Pass_port.lastRules);
    var baseName = null, homeFolder = null, myFolder, seqData;



    function buildUI(thisObj){
    
        
        // PALETTE
        var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", Pass_port.scriptName + " v " + Pass_port.version, undefined, {resizeable: true});    

        if (palette !== null)
        {
            
            // palette continues
        
            palette.orientation = "column"; 
            palette.alignChildren = ["center","top"]; 
            palette.spacing = 10; 
            palette.margins = 16; 

            // GRP1

            var grp1 = palette.add("group", undefined, {name: "grp1"}); 
            grp1.orientation = "row"; 
            grp1.alignChildren = ["left","center"]; 
            grp1.spacing = 10; 
            grp1.margins = 0; 
            grp1.alignment = ["left","top"]; 

            var txtRules = grp1.add("statictext", undefined, undefined, {name: "txtRules"}); 
            txtRules.helpTip = "Current set of rules. Supports Redshift C4D only by now"; 
            txtRules.text = "Rules"; 
            txtRules.justify = "right"; 

            var lstRules_array = ruleNames; 
            var lstRules = grp1.add("dropdownlist", undefined, undefined, {name: "lstRules", items: lstRules_array}); 
            lstRules.enabled = false; 
            lstRules.helpTip = "Current set of rules. Supports Redshift C4D only by now"; 
            lstRules.selection = Pass_port.lastRules; 
            lstRules.preferredSize.width = 250; 

            // GRP2

            var grp2 = palette.add("group", undefined, {name: "grp2"}); 
            grp2.orientation = "row"; 
            grp2.alignChildren = ["left","center"]; 
            grp2.spacing = 10; 
            grp2.margins = 0; 
            grp2.alignment = ["left","center"]; 

            var txtSeparator = grp2.add("statictext", undefined, undefined, {name: "txtSeparator"}); 
            txtSeparator.helpTip = "Pass name parsing separator"; 
            txtSeparator.text = "Separator"; 

            var fldSeparator = grp2.add('edittext {properties: {name: "fldSeparator"}}'); 
            fldSeparator.helpTip = "Pass name parsing separator"; 
            fldSeparator.text = Pass_port.AOVtag; 
            fldSeparator.preferredSize.width = 80;

            var txtFPS = grp2.add("statictext", undefined, undefined, {name: "txtFPS"}); 
            txtFPS.text = "FPS"; 
            txtFPS.justify = "right"; 

            var fldFPS = grp2.add('edittext {properties: {name: "fldFPS"}}'); 
            fldFPS.text = Pass_port.FPS; 
            fldFPS.preferredSize.width = 60;

            //GRP3

            var grp2b = palette.add("group", undefined, {name: "grp2"}); 
            grp2b.orientation = "row"; 
            grp2b.alignChildren = ["center","center"]; 
            grp2b.spacing = 10; 
            grp2b.margins = 0; 
            grp2b.alignment = ["left","center"]; 

            var chkAutocomp = grp2b.add("checkbox", undefined, undefined, {name: "chkAutocomp"}); 
            chkAutocomp.helpTip = "Sort footage into compositions"; 
            chkAutocomp.text = "Auto compositions"; 
            chkAutocomp.alignment = ["left","center"]; 
            chkAutocomp.value = Pass_port.autoComp;

            var chkStraightA = grp2b.add("checkbox", undefined, undefined, {name: "chkStraightA"}); 
            chkStraightA.helpTip = "Straight Alpha (if present)"; 
            chkStraightA.text = "Straight Alpha"; 
            chkStraightA.alignment = ["left","center"]; 
            chkStraightA.value = Pass_port.straightA;


            // div 1

            var div1 = palette.add("panel", undefined, undefined, {name: "div1"}); 
            div1.alignment = "fill"; 

            // GRP3

            var grp3 = palette.add("group", undefined, {name: "grp3"}); 
            grp3.orientation = "row"; 
            grp3.alignChildren = ["left","center"]; 
            grp3.spacing = 10; 
            grp3.margins = 0; 
            grp3.alignment = ["left","top"]; 

            var txtPath = grp3.add("statictext", undefined, undefined, {name: "txtPath"}); 
            txtPath.helpTip = "Path to renderpass files"; 
            txtPath.text = "Path"; 

            var fldPath =  grp3.add('edittext {properties: {name: "fldPath"}}'); 
            fldPath.helpTip = "Path to renderpass files";
            fldPath.preferredSize.width = 250;
            fldPath.text = Pass_port.lastPath;

            var btnBrowse = grp3.add("button", undefined, undefined, {name: "brtnBrowse"}); 
            btnBrowse.text = "Browse"; 
            btnBrowse.helpTip = "Browse to a folder to analyze";

            // GRP4

            var grp4 = palette.add("group", undefined, {name: "grp4"}); 
            grp4.orientation = "row"; 
            grp4.alignChildren = ["left","center"]; 
            grp4.spacing = 10; 
            grp4.margins = 0; 
            grp4.alignment = ["left","top"]; 

            var txtBaseName = grp4.add("statictext", undefined, undefined, {name: "txtBaseName"}); 
            txtBaseName.text = "Basename"; 
            txtBaseName.helpTip = "Basename is a shared name, stripped of all attributes";

            var fldBaseName = grp4.add('edittext {properties: {name: "fldBaseName"}}'); 
            fldBaseName.preferredSize.width = 223; 

            var btnPort = grp4.add("button", undefined, undefined, {name: "fldPort"}); 
            btnPort.text = "Port"; 
            btnPort.helpTip = "Only enabled if a valid basename had been acquired";
            //btnPort.preferredSize.width = 300; 
            btnPort.enabled = false;

            // div 2

            var div2 = palette.add("panel", undefined, undefined, {name: "div2"}); 
            div2.alignment = "fill"; 

            // GRP5

            var grp5 = palette.add("group", undefined, {name: "grp5"}); 
            grp5.orientation = "row"; 
            grp5.alignChildren = ["left","center"]; 
            grp5.spacing = 10; 
            grp5.margins = 0; 

            // GRP6

            var grp6 = palette.add("group", undefined, {name: "grp6"}); 
            grp6.orientation = "row"; 
            grp6.alignChildren = ["left","center"]; 
            grp6.spacing = 10; 
            grp6.margins = 0; 
            grp6.alignment = ["left","top"]; 

            var txtImported = grp6.add("statictext", undefined, undefined, {name: "txtImported"}); 
            txtImported.text = "Imported"; 
            txtImported.justify = "right"; 
            txtImported.helpTip = "Succesfully imported and classified sequences number";

            var fldImported = grp6.add('edittext {properties: {name: "fldImported"}}'); 
            fldImported.text = "0";
            fldImported.preferredSize.width = 40; 
            fldImported.helpTip = "Succesfully imported and classified sequences number";
            fldImported.enabled = false;

            var txtSkipped = grp6.add("statictext", undefined, undefined, {name: "txtSkipped"}); 
            txtSkipped.text = "Skipped"; 
            txtSkipped.justify = "right";
            txtSkipped.helpTip = "Skipped sequences";

            var fldSkipped = grp6.add('edittext {properties: {name: "fldSkipped"}}'); 
            fldSkipped.text = "0"; 
            fldSkipped.preferredSize.width = 40;
            fldSkipped.helpTip = "Skipped sequences";
            fldSkipped.enabled = false;

            var txtComps = grp6.add("statictext", undefined, undefined, {name: "txtComps"}); 
            txtComps.text = "Comps"; 
            txtComps.justify = "right"; 

            var fldComps = grp6.add('edittext {properties: {name: "fldComps"}}'); 
            fldComps.text = "0"; 
            fldComps.preferredSize.width = 40;
            fldComps.enabled = false;


            palette.layout.layout(true);
            palette.layout.resize();
            palette.onResizing = palette.onResize = function () {this.layout.resize();}


            fldFPS.onChange = function() {

                Pass_port.FPS = fldFPS.text;
                saveSettings("frameRate", Pass_port.FPS);

            }

            fldSeparator.onChange = function() {

                Pass_port.AOVtag = fldSeparator.text;
                saveSettings("AOVtag", Pass_port.AOVtag);

            }


            chkAutocomp.onChange = function() {

                Pass_port.autoComp = chkAutocomp.value;
                saveSettings("autoComp", Pass_port.autoComp);

            }

            chkStraightA.onChange = function() {

                Pass_port.straightA = chkStraightA.value;
                saveSettings("straightA", Pass_port.straightA);

            }


            btnBrowse.onClick = function() { 

                var cFolder;

                if (Pass_port.lastPath != null) {

                    cFolder = new Folder(Pass_port.lastPath)
                    logIt("Last used path detected: " + Pass_port.lastPath , 1);

                } else if (app.project.file != null) {

                    cFolder = new Folder(app.project.file.path)
                    logIt("Project path detected: " + app.project.file.path , 1);

                } 
            
                if (cFolder instanceof Folder) { 

                    //

                } else {
                 
                    cFolder = new Folder;
                    logIt("The path was not found and is reset" , 1);
                
                }
                logIt("Browsing to: " + cFolder.fsName , 1);


                myFolder = cFolder.selectDlg("Select the renderpass folder")

                if (myFolder != null) {
                    
                    btnBrowse.enabled = false;
                    btnPort.enabled = false;
                    fldBaseName.enabled = false;

                    getBaseName(myFolder);
                    
                    btnBrowse.enabled = true;
                    fldBaseName.enabled = true;
                    fldPath.text = myFolder.fsName.replace("\\null", "");

                    if (baseName != null) {
                    
                        fldBaseName.text = baseName;
                        btnPort.enabled = true;
                        Pass_port.lastPath = fldPath.text;
                        saveSettings("lastPath", Pass_port.lastPath);

                    } else {

                        fldBaseName.text = "";
                        btnPort.enabled = false;

                    }

                } else {

                    btnPort.enabled = false;
        
                } // folder check

            } // browse onclick


            btnPort.onClick = function() { 

                baseName = fldBaseName.text;

                if (baseName != null) {

                    btnBrowse.enabled = false;
                    btnPort.enabled = false;
                    fldBaseName.enabled = false;

                    seqData = GetData(myFolder); 

                    btnBrowse.enabled = true;
                    fldBaseName.enabled = true;
                    btnPort.enabled = true;
        
                    if ((seqData) && (seqData.length > 0)) {
        
                        var filesImported = importData(seqData, Pass_port.FPS);
                        logIt("   " + filesImported + " imported", 1);
        
                        if (filesImported > 0) {
                            var compsCreated = autoComp(seqData)
                        }
        
                    }
                
                } //basename check
        
                fldImported.text = filesImported;
                fldSkipped.text = seqData.length - filesImported;
                fldComps.text = compsCreated;
                logIt((seqData) ? ("Ported! " + seqData.length + " sequences found, " + filesImported + " imported, " + compsCreated + " new comps created") : "Nothing ported!" , 1);

            } // port onclick

            return palette

        } else {

            logIt("Cannot create palette window", 1)

        } // if palette


    } // buildUI()



    function getRules(n) {

        switch(n) {

            case 0: 
                // RS C4D
                return [{name: "Beauty", tag: "Beauty", alttag: "Beauty", type: 0, light: true},
                        {name: "Main", tag: "Main", alttag: "Main", type: 0, light: false},
                        {name: "Diffuse Lighting", tag: "Diffuse", alttag: "Diff", type: 0, light: true}, 
                        {name: "Specular Lighting", tag: "SpecularLighting", alttag: "Spec", type: 0, light: true},
                        {name: "Reflections", tag: "Reflections", alttag: "Refl", type: 0, light: true},
                        {name: "Refractions", tag: "Refractions", alttag: "Refr", type: 0, light: true},
                        {name: "Subsurface Scatter", tag: "SSS", alttag: "Subsurf", type: 0, light: true},
                        {name: "Caustics", tag: "Caustics", alttag: "Caust", type: 0, light: true},
                        {name: "Emission", tag: "Emission", alttag: "Emissive", type: 0, light: true},
                        {name: "Global Illumination", tag: "GI", alttag: "Global", type: 0, light: true},
                        {name: "Volume Lighting", tag: "VolumeLighting", alttag: "VolLight", type: 0, light: true},
                        {name: "Volume Fog Emission", tag: "VolumeFogEmission", alttag: "VolFogEm", type: 0, light: false},
                        {name: "Volume Fog Tint", tag: "VolumeFogTint", alttag: "VolFogTint", type: 0, light: false},
                        {name: "Background", tag: "Background", alttag: "BG", type: 0, light: false},

                        {name: "Diffuse Filter", tag: "DiffuseFilter", alttag: "DiffFlt", type: 1, light: false},
                        {name: "Diffuse Lighting Raw", tag: "DiffuseLightingRaw", alttag: "DiffRaw", type: 1, light: false},
                        {name: "Reflections Filter", tag: "ReflectionsFilter", alttag: "ReflFlt", type: 1, light: false},
                        {name: "Reflections Raw", tag: "ReflectionsRaw", alttag: "ReflRaw", type: 1, light: false},
                        {name: "Refractions Filter", tag: "RefractionsFilter", alttag: "RefrFlt", type: 1, light: false},
                        {name: "Refractions Raw", tag: "RefractionsRaw", alttag: "RefrRaw", type: 1, light: false},
                        {name: "Subscatter Surface Raw", tag: "SubsurfaceRaw", alttag: "SSSRaw", type: 1, light: false},
                        {name: "Global Illumination Raw", tag: "GIRaw", alttag: "GlobalRaw", type: 1, light: false},
                        {name: "Caustics Raw", tag: "CausticsRaw", alttag: "CaustRaw", type: 1, light: false},
                        {name: "Translucency Filter", tag: "TransTint", alttag: "TransFlt", type: 1, light: false},
                        {name: "Transclucency Lighting Raw", tag: "TotalTransLightingRaw", alttag: "TransRaw", type: 1, light: false},
                        {name: "Translucency GI Raw", tag: "TranslucencyGIRaw", alttag: "TransGIRaw", type: 1, light: false},
                        {name: "Total Diffuse Lighting Raw", tag: "TotalDiffuseLightingRaw", alttag: "TotalRaw", type: 1, light: false},
                        
                        {name: "World Position", tag: "P", alttag: "Pos", type: 2, light: false},
                        {name: "Object Position", tag: "ObjectPosition", alttag: "ObjPos", type: 2, light: false},
                        {name: "Normals", tag: "N", alttag: "Norm", type: 2, light: false},
                        {name: "Bump Normals", tag: "BumpNormals", alttag: "BumpNorm", type: 2, light: false},
                        {name: "Object-Space Bump Normals", tag: "ObjectBumpNormal", alttag: "ObjNorm", type: 2, light: false},
                        {name: "Object-Space Positions", tag: "ObjectPosition", alttag: "ObjPos", type: 2, light: false},
                        {name: "Object ID", tag: "ObjectID", alttag: "ID", type: 2, light: false},
                        {name: "Depth", tag: "Z", alttag: "Depth", type: 2, light: false},
                        {name: "Shadows", tag: "Shadows", alttag: "Shad", type: 2, light: false},
                        {name: "Motion Vectors", tag: "MotionVectors", alttag: "MV", type: 2, light: false},
                        {name: "Puzzle Matte", tag: "PuzzleMatte", alttag: "Puzzle", type: 2, light: false},
                        {name: "Ambient Occusion", tag: "AO", alttag: "Occlusion", type: 3, light: false},
                        {name: "Custom", tag: "Custom", alttag: "Cust", type: 2, light: false},
                        {name: "Cryptomatte", tag: "Cryptomatte", alttag: "Crypto", type: 2, light: false},
                        {name: "IDs and Coverage", tag: "IDsAndCoverage", alttag: "Coverage", type: 2, light: false}];
                break;

            case 1:
                return null;
                break;

            case 2:
                return null;
                break;
        
        }
                
    } // getRules()



    function getSettings (sectionName) {
        
        if (!app.settings.haveSetting(Pass_port.scriptName, sectionName)) return null;
            
        var savedSetting = app.settings.getSetting(Pass_port.scriptName, sectionName);
            
        if (savedSetting == "false") {
            savedSetting = false;
        } else if (savedSetting == "true") {
            savedSetting = true;
        } else {
            savedSetting; 
        }
                          
        return savedSetting;
        
    } // getSettings()



    function saveSettings (section, value) { 
        
        app.settings.saveSetting(Pass_port.scriptName, section, value)
    
    }



    function logIt(logStr, logTime){

        try {

            var logFile = new File(Pass_port.logFile);
            var dts = new Date().toLocaleTimeString();

            logFile.open((logFile.exists) ? "a" : "w");
            if (logTime) {

                    logFile.writeln(dts + " " + logStr)
                } else {

                    logFile.write(logStr)
            }
            logFile.close();
        
        } catch(err) {

            alert(err.toString())
        }
    } // logIt()



    function FilterFilesExt(arg) {

        return arg.name.search("(exr|tif|tiff|jpg|jpeg|png)$")
    }



    function getFileExt(filename) {

        var ep = filename.lastIndexOf(".");
        return [ep, filename.substr(ep)]
    }


 
    function GetFiles(sourceFolder) {


        var myFiles = [];

        if ((sourceFolder.exists) && (sourceFolder instanceof Folder)) {

            try { 

                logIt("The folder " + sourceFolder.fsName + " assigned", 1);
                myFiles = sourceFolder.getFiles(FilterFilesExt).sort();
                
            } catch(err) {

                logIt("Some filesystem error: " + sourceFolder.error, 1);
                alert(err.toString());
                return 0
            }   
        } else {

            alert("The specified folder was not found", Pass_port.scriptName);
            return 0
        } // if folder exists

        if (myFiles.length > 0) {
        
            logIt("Total Files: " + myFiles.length, 1);
            return myFiles

        } else {

            alert("There were no sequence files found in the folder", Pass_port.scriptName);
            logIt("No sequences found!");
            return 0
        } // if myFiles has files
    } // getfiles()



    function getBaseName(sourceFolder) {


        var sourceFiles = GetFiles(sourceFolder);
        var aovTagPos = -1, counterPos = -1;

        if (sourceFiles.length > 0)  {

            baseName = null; // reset global baseName
            
            for (var i = 0; i < sourceFiles.length; i++) {
                
                aovTagPos = sourceFiles[i].name.indexOf(Pass_port.AOVtag); // aov tag not present
                if (aovTagPos != -1) {

                    baseName = sourceFiles[i].name.substring(0, aovTagPos);
                    logIt("baseName from no AOV tag filename: " + baseName, 1);
                } 

                counterPos = sourceFiles[i].name.search("\\d{4,}"); // the counter present
                if (counterPos != -1) {

                    if (baseName != null) { // and AOVtag was found too

                        logIt("No AOV tag in this filename. This must be the main beauty pass", 1);
                        break

                    } else { // no AOV tag found, getting the new baseName or overwriting (should be the same)

                        baseName = sourceFiles[i].name.substring(0, counterPos);
                        logIt("The Basename from AOV tagged filename: \"" + baseName + "\"", 1);
                        break
                    }

                } else {

                    break
                }
            } // for
        }// if theres files
    } // getBasename()



    function GetData(sourceFolder) {

        var counterPos = -1, sourceFiles = GetFiles(sourceFolder);

        if ((baseName != null) & (sourceFiles.length > 0)) {

            // 1 collecting the sequences
            // 1a strip filenames to pass tags storing to the equal array
            logIt("Now enumerating the sequences...", 1);
            var strippedNames = [], afterNamePos = baseName.length, aovPos;

            for (var i = 0; i < sourceFiles.length; i++) {

                counterPos = sourceFiles[i].name.search("\\d{4,}");
                if (counterPos == -1) counterPos = sourceFiles[i].name.length;
                
                // checking for AOV tag presence right next to the baseName
                aovPos = sourceFiles[i].name.search(Pass_port.AOVtag);
                if (aovPos != -1) afterNamePos = aovPos + Pass_port.AOVtag.length;
                strippedNames[i] = sourceFiles[i].name.substring(afterNamePos, counterPos);
            }

            // 1b selecting each new stripped name and adding to the list of uniques
            var uniSequences = [];
            uniSequences.push(0);
            logIt("   Fisrt sequence added: " + ((strippedNames[0] == "") ? "Beauty" : strippedNames[0]), 1);

            for (var f = 1; f < sourceFiles.length; f++) {
        
                if (strippedNames[f-1] != strippedNames[f]) {
                    uniSequences.push(f);
                    logIt("   New sequence found and added: " + strippedNames[f], 1);
                    f++;
                }
            }

            logIt("Total unique sequences found: " + uniSequences.length, 1);

            // 1c classifing the sequences
            logIt("Now classifying the footage...", 1);

            var cFlag = false; cCount = 0;

            sequenceData = [];

            for (var s = 0; s < uniSequences.length; s++) {

                cFlag = false;

                if (strippedNames[uniSequences[s]] == "") { // considered default Beauty pass

                    sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: 0, passname: passList[0].name, lightid: -1, lightname: 0});
                    cFlag = true; cCount++;
                    logIt("   " + sourceFiles[uniSequences[s]].name + " is " + passList[0].name, 1);

                } else { 

                    for (var p = 0; p < passList.length; p++) {

                        if ((strippedNames[uniSequences[s]].indexOf(passList[p].tag) != -1) || (strippedNames[uniSequences[s]].indexOf(passList[p].alttag) != -1)) {

                            sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: p, passname: passList[p].name, lightid: -1, lightname: 0});
                            cFlag = true; cCount++;
                            logIt("   " + sourceFiles[uniSequences[s]].name + " is " + passList[p].name, 1);
                            break;
                        }
                    }
                }

                if (!cFlag) {

                    logIt("    Unable to classify " + sourceFiles[uniSequences[s]].name + ". Skipping!", 1)
                }
            }

            logIt("   " + cCount + " of " + sequenceData.length + " passes were classified", 1);

            
            // 2 Ligtpass groups processing, if any

            logIt("Now searching for light groups...", 1);

            var lightGroups = [], lp, sp;

            for (var s = 0; s < sequenceData.length; s++) {

                lp = strippedNames[sequenceData[s].fileid].split("_");

                if (lp[1] != undefined) {

                    sp = -1;
                    for (var i = 0; i < lightGroups.length; i++) {
                        if (lightGroups[i] == lp[1]) {
                            sp = i;
                            break
                        }
                    }

                    if (sp == -1) {
                        
                        lightGroups.push(lp[1]);
                        sequenceData[s].lightid = lightGroups.length - 1;
                    } else {

                        sequenceData[s].lightid = sp;
                    }
                    sequenceData[s].lightname = lp[1];
                    logIt("   "+ strippedNames[sequenceData[s].fileid] + " is in lightgroup " + lp[1] + " [" + sequenceData[s].lightid + "]", 1);
                }
            }

            logIt("   " + lightGroups.length + " lightgroups detected", 1);

        } // if baseName
        
        return sequenceData    
    } // GetData()
    
    

    function importData(sequenceData, FPS) {

        
        var currentProj = app.project, iCount = 0;
        
        if ((currentProj) && (sequenceData.length > 0)) {
        
            app.beginUndoGroup(Pass_port.scriptName + " import");
            logIt("Now importing footage...", 1);
            
            var importOptions, importedFile;
            var importHome = currentProj.rootFolder, lightFolders=[];
            if (currentProj.activeItem != null) {

                importHome = (currentProj.activeItem.typeName == "Folder") ? currentProj.activeItem : currentProj.rootFolder
            }

            homeFolder = currentProj.items.addFolder(Pass_port.homeFolderName + " - " + baseName);
            homeFolder.parentFolder = importHome;
            var setFolder = currentProj.items.addFolder(baseName + " Footage");
            setFolder.parentFolder = homeFolder;
            
            for (var f = 0; f < sequenceData.length; f++) {
                
                importOptions = new ImportOptions(sequenceData[f].file);
                importOptions.sequence = true;
                
                var importedFile = currentProj.importFile(importOptions);
                importedFile.mainSource.conformFrameRate = FPS;
                sequenceData[f].footage = importedFile;

                if (sequenceData[f].lightid != -1) { // if the footage in a lightgroup

                    if (lightFolders[sequenceData[f].lightid] == undefined ) { // look if this lightgroup has a folder

                        lightFolders[sequenceData[f].lightid] = currentProj.items.addFolder(sequenceData[f].lightname);

                    }

                    importedFile.parentFolder = lightFolders[sequenceData[f].lightid]; 
                    lightFolders[sequenceData[f].lightid].parentFolder = setFolder;

                } else { 
                    
                    importedFile.parentFolder = setFolder
                }

                iCount++
            }

            app.endUndoGroup();

        } // if current project and data

        return iCount 

    } // importData()



    function autoComp(sequenceData) {

        var currentProj = app.project, cCount = 0, newComps = [];

        if ((currentProj) && (sequenceData.length > 0) && (homeFolder != null)) {

            logIt("Now compositing...", 1);
            app.beginUndoGroup(Pass_port.scriptName + " Autocomp");
            var tItem = sequenceData[0].footage, tLayer;
            compFolder = currentProj.items.addFolder(baseName + " Auto Compositions");
            compFolder.parentFolder = homeFolder;

            //create default comp
            var defComp = currentProj.items.addComp("Main", tItem.width, tItem.height, tItem.pixelAspect, tItem.duration, tItem.frameRate);
            defComp.parentFolder = compFolder;
            cCount++;

            for (var s = 0; s < sequenceData.length; s++) {

                if (sequenceData[s].lightid != -1) { // if the footage in a lightgroup
                    
                    if (newComps[sequenceData[s].lightid] == undefined ) { // look if this lightgroup has a comp already

                        newComps[sequenceData[s].lightid] = currentProj.items.addComp(sequenceData[s].lightname, tItem.width, tItem.height, tItem.pixelAspect, tItem.duration, tItem.frameRate);
                        newComps[sequenceData[s].lightid].parentFolder = compFolder;
                        cCount++;

                    }

                    // adding layers
                    tLayer = newComps[sequenceData[s].lightid].layers.add(sequenceData[s].footage);
                    tLayer.blendingMode = BlendingMode.ADD;
                    sequenceData[s].layer = tLayer;

                } else { // to main comp

                    tLayer = defComp.layers.add(sequenceData[s].footage);
                    tLayer.blendingMode = BlendingMode.ADD;
                    sequenceData[s].layer = tLayer;

                }

            }

            app.endUndoGroup();
            defComp.openInViewer;
            return cCount

        } // if current project and data

    } // autoComp()

 
 
    ////////////////// main ////////////////

    var stDate = new Date();
    logIt("\n" + Pass_port.scriptName + " v." + Pass_port.version + " initialized at " + stDate.toLocaleString() + ", current project: " + app.project.name + "\n" , 0);

    var trToolPal = buildUI(thisObj);

    if (trToolPal !== null)
    {
        if (trToolPal instanceof Window)
        {
            // Show the palette
            trToolPal.center();
            trToolPal.show();
        }
        else
            trToolPal.layout.layout(true);
    }
            

})(this);
