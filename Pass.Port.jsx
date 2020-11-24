// Pass_port by Keerah
// prototype ver 0.1

(function Pass_port(thisObj) {

    var Pass_port = new Object;
        Pass_port.scriptName = "Pass.port";
        Pass_port.version = "0.31";
        Pass_port.AOVtag = "_AOV_";
        Pass_port.homeFolderName = "RS render passes";
        Pass_port.logFile = app.project.file.path + "\\pass.port_log.txt";

    var passList = [{name: "Beauty", tag: "Beauty", alttag: "Beauty", type: 0, light: false},
                    {name: "Diffuse Lighting", tag: "Diffuse", alttag: "Diff", type: 0, light: true}, 
                    {name: "Specular Lighting", tag: "Speculars", alttag: "Specs", type: 0, light: true},
                    {name: "Reflections", tag: "Reflections", alttag: "Reflect", type: 0, light: true},
                    {name: "Refractions", tag: "Refractions", alttag: "Refract", type: 0, light: true},
                    {name: "Subsurface Scatter", tag: "SSS", alttag: "Subsurface", type: 0, light: true},
                    {name: "Caustics", tag: "Caustics", alttag: "Caust", type: 0, light: true},
                    {name: "Emission", tag: "Emission", alttag: "Emissive", type: 0, light: true},
                    {name: "Global Illumination", tag: "GI", alttag: "Global", type: 0, light: true},
                    {name: "Volume Lighting", tag: "VolumeLighting", alttag: "VolLight", type: 0, light: true},
                    {name: "Volume Fog Emission", tag: "VolumeFogEmission", alttag: "VolFogEm", type: 0, light: false},
                    {name: "Volume Fog Tint", tag: "VolumeFogTint", alttag: "VolFogTint", type: 0, light: false},
                    {name: "Background", tag: "Background", alttag: "BG", type: 0, light: false},
                    {name: "Diffuse Filter", tag: "DiffuseFilter", alttag: "DiffFlt", type: 1, light: true},
                    {name: "Diffuse Lighting Raw", tag: "DiffuseLightingRaw", alttag: "DiffRaw", type: 1, light: true},
                    {name: "Reflection Filter", tag: "ReflectionFilter", alttag: "ReflFlt", type: 1, light: true},
                    {name: "Reflection Raw", tag: "ReflectionRaw", alttag: "ReflRaw", type: 1, light: true},
                    {name: "Refraction Filter", tag: "RefractionFilter", alttag: "RefrFlt", type: 1, light: true},
                    {name: "Refraction Raw", tag: "RefractionRaw", alttag: "RefrRaw", type: 1, light: true},
                    {name: "Subscatter Surface Raw", tag: "SubscatterSurfaceRaw", alttag: "SSSRaw", type: 1, light: true},
                    {name: "Global Illumination Raw", tag: "GIRaw", alttag: "GlobalRaw", type: 1, light: true},
                    {name: "Caustics Raw", tag: "CausticsRaw", alttag: "CaustRaw", type: 1, light: true},
                    {name: "Translucency Filter", tag: "TransTint", alttag: "TransFlt", type: 1, light: false},
                    {name: "Transclucency Lighting Raw", tag: "TotalTransLightingRaw", alttag: "TransRaw", type: 1, light: false},
                    {name: "Translucency GI Raw", tag: "TranslucencyGIRaw", alttag: "TransGIRaw", type: 1, light: false},
                    {name: "World Position", tag: "WorldPosition", alttag: "WorldPos", type: 2, light: false},
                    {name: "Object Position", tag: "ObjectPosition", alttag: "ObjPos", type: 2, light: false},
                    {name: "Normals", tag: "Normals", alttag: "Norm", type: 2, light: false},
                    {name: "Bump Normals", tag: "BumpNormals", alttag: "BumpNorm", type: 2, light: false},
                    {name: "Object Bump Normals", tag: "ObjectBumpNormals", alttag: "ObjNorm", type: 2, light: false},
                    {name: "Depth", tag: "Z", alttag: "Depth", type: 2, light: false},
                    {name: "Shadows", tag: "Shadows", alttag: "Shadow", type: 2, light: false},
                    {name: "Motion Vectors", tag: "MotionVectors", alttag: "MV", type: 2, light: false},
                    {name: "Puzzle Matte", tag: "PuzzleMatte", alttag: "Puzzle", type: 2, light: false},
                    {name: "Ambient Occusion", tag: "AO", alttag: "Occlusion", type: 3, light: false}]


    var passType =  ["Standard Shading AOV",
                    "Raw Shading AOV",
                    "Utility AOV",
                    "Deprecated AOV"];

    var sequenceData = [], baseName = null, homeFolder = null;



    function LogIt(logStr, logTime){

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
    }

    function FilterFilesExt(arg) {

        return arg.name.search("(exr|tif|tiff|jpg|jpeg)$")
    }



    function getFileExt(filename) {

        var ep = filename.lastIndexOf(".");
        return [ep, filename.substr(ep)]
    }


 
    function GetFiles(sourceFolder) {


        var myFiles = [];

        if ((sourceFolder.exists) && (sourceFolder instanceof Folder)) {

            try { 

                LogIt("The folder " + sourceFolder.fsName + " assigned", 1);
                myFiles = sourceFolder.getFiles(FilterFilesExt).sort();
                
            } catch(err) {

                LogIt("Some filesystem error: " + sourceFolder.error, 1);
                alert(err.toString());
                return 0
            }   
        } else {

            alert("The specified folder was not found", Pass_port.scriptName);
            return 0
        } // if folder exists

        if (myFiles.length > 0) {
        
            LogIt("Total Files: " + myFiles.length, 1);
            return myFiles

        } else {

            alert("There were no sequence files found in the folder", Pass_port.scriptName);
            LogIt("No sequences found!");
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
                    LogIt("baseName from no AOV tag filename: " + baseName, 1);
                } 

                counterPos = sourceFiles[i].name.search("\\d{4,}"); // the counter present
                if (counterPos != -1) {

                    if (baseName != null) { // and AOVtag was found too

                        LogIt("No AOV tag in this filename. This must be the main beauty pass", 1);
                        break

                    } else { // no AOV tag found, getting the new baseName or overwriting (should be the same)

                        baseName = sourceFiles[i].name.substring(0, counterPos);
                        LogIt("The Basename from AOV tagged filename: \"" + baseName + "\"", 1);
                        break
                    }

                } else {

                    break
                }
            } // for
        }// if theres files
    } // getBasename



    function GetData(sourceFolder) {

        var counterPos = -1, sourceFiles = GetFiles(sourceFolder);

        if ((baseName != null) & (sourceFiles.length > 0)) {

            // 1 collecting the sequences
            // 1a strip filenames to pass tags storing to the equal array
            LogIt("Now enumerating the sequences...", 1);
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
            LogIt("   Fisrt sequence added: " + ((strippedNames[0] == "") ? "Beauty" : strippedNames[0]), 1);

            for (var f = 1; f < sourceFiles.length; f++) {
        
                if (strippedNames[f-1] != strippedNames[f]) {
                    uniSequences.push(f);
                    LogIt("   New sequence found and added: " + strippedNames[f], 1);
                    f++;
                }
            }

            LogIt("Total unique sequences found: " + uniSequences.length, 1);

            // 1c classifing the sequences
            LogIt("Now classifying the footage...", 1);

            var cFlag = false; cCount = 0;

            sequenceData = [];

            for (var s = 0; s < uniSequences.length; s++) {

                cFlag = false;

                if (strippedNames[uniSequences[s]] == "") { // considered default Beauty pass

                    sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: 0, passname: passList[0].name, lightid: -1, lightname: 0});
                    cFlag = true; cCount++;
                    LogIt(sourceFiles[uniSequences[s]].name + " is " + passList[0].name, 1);

                } else { 

                    for (var p = 0; p < passList.length; p++) {

                        if ((strippedNames[uniSequences[s]].indexOf(passList[p].tag) != -1) || (strippedNames[uniSequences[s]].indexOf(passList[p].alttag) != -1)) {

                            sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: p, passname: passList[p].name, lightid: -1, lightname: 0});
                            cFlag = true; cCount++;
                            LogIt("   " + sourceFiles[uniSequences[s]].name + " is " + passList[p].name, 1);
                            break;
                        }
                    }
                }

                if (!cFlag) {

                    LogIt(sourceFiles[uniSequences[s]].name + " was not classified. Skipping!", 1)
                }
            }

            LogIt(cCount + " of " + sequenceData.length + " passes were classified", 1);

            
            // 2 Ligtpass groups processing, if any

            LogIt("Now searching for light groups...", 1);

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
                    LogIt("   "+ strippedNames[sequenceData[s].fileid] + " is in lightgroup " + lp[1] + " [" + sequenceData[s].lightid + "]", 1);
                }
            }

            LogIt(lightGroups.length + " lightgroups detected", 1);

        } // if baseName
        
        return sequenceData    
    } // GetData
    
    

    function importData(sequenceData, FPS) {

        
        var currentProj = app.project, iCount = 0;
        
        if ((currentProj) && (sequenceData.length > 0)) {
        
            app.beginUndoGroup(Pass_port.scriptName + " import");
            LogIt("Now importing footage...", 1);
            
            var importOptions, importedFile;
            var importHome = currentProj.rootFolder, lightFolders=[];
            if (currentProj.activeItem != null) {

                importHome = (currentProj.activeItem.typeName == "Folder") ? currentProj.activeItem : currentProj.rootFolder
            }

            homeFolder = currentProj.items.addFolder(Pass_port.homeFolderName);
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

    } // importData



    function autoComp(sequenceData) {

        var currentProj = app.project, cCount = 0, newComps = [];

        if ((currentProj) && (sequenceData.length > 0) && (homeFolder != null)) {

            LogIt("Now compositing...", 1);
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

    }


    function buildUI(thisObj){
    
        
        // PALETTE
        var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", Pass_port.scriptName + " v" + Pass_port.version, undefined, {resizeable: true});    

        if (palette !== null)
        {
            
        }


    } // buildUI


    ////////////////// main
    var stDate = new Date();
    LogIt("\n--- New run inititated at " + stDate.toLocaleString() + " ---\n", 0);

    // var trToolPal = buildUI(thisObj);

    // if (trToolPal !== null)
    //         {
    //             if (trToolPal instanceof Window)
    //             {
    //                 // Show the palette
    //                 trToolPal.center();
    //                 trToolPal.show();
    //             }
    //             else
    //                 trToolPal.layout.layout(true);
    //         }


    //var myFolder = "D:\\keerah\\PROJECTS\\00\\ForestZoom1\\"; 

    
    if (app.project.file instanceof File) {

        var prjFolder = new Folder(app.project.file.path);
        var myFolder = prjFolder.selectDlg("Select the renderpass folder")
    } else {

        var myFolder = Folder.selectDialog("Select the renderpass folder")
    }

    if (myFolder != null) {

        getBaseName(myFolder);

        if (baseName != null) {

            var seqData = GetData(myFolder); 

            if ((seqData) && (seqData.length > 0)) {

                var filesImported = importData(seqData, 25);
                LogIt(filesImported + " imported", 1);

                if (filesImported > 0) {

                    var compsCreated = autoComp(seqData)
                }

            } else {
            
                //
            }
        
        } //basename check

    } // folder check

    LogIt((seqData) ? (seqData.length + " sequences found, " + filesImported + " imported, " + compsCreated + " new comps created") : "Nothing's done" , 1);
    stDate = new Date();
    LogIt("--- Finished at " + stDate.toLocaleString() + "---", 0);
})(this);
