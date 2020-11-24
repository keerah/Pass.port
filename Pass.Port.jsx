// RSpass2AE by Keerah
// prototype ver 0.1

(function RSpass2AE(thisObj) {

    var RSpass2AE =  new Object;
        RSpass2AE.scriptName = "RS passes to AE";
        RSpass2AE.version = "0.25";
        RSpass2AE.AOVtag = "_AOV_";
        RSpass2AE.homeFolderName = "RS render passes";

    var passList = [{name: "Beauty", tag: "Beauty", type: 0, light: false},
                    {name: "Diffuse Lighting", tag: "Diffuse", type: 0, light: true}, 
                    {name: "Specular Lighting", tag: "Speculars", type: 0, light: true},
                    {name: "Reflections", tag: "Reflections", type: 0, light: true},
                    {name: "Refractions", tag: "Refractions", type: 0, light: true},
                    {name: "Subsurface Scatter", tag: "SSS", type: 0, light: true},
                    {name: "Caustics", tag: "Caustics", type: 0, light: true},
                    {name: "Emission", tag: "Emission", type: 0, light: true},
                    {name: "Global Illumination", tag: "GI", type: 0, light: true},
                    {name: "Volume Lighting", tag: "VolumeLighting", type: 0, light: true},
                    {name: "Volume Fog Emission", tag: "VolumeFogEmission", type: 0, light: false},
                    {name: "Volume Fog Tint", tag: "VolumeFogTint", type: 0, light: false},
                    {name: "Background", tag: "Background", type: 0, light: false},
                    {name: "Diffuse Filter", tag: "DiffuseFilter", type: 1, light: true},
                    {name: "Diffuse Lighting Raw", tag: "DiffuseLightingRaw", type: 1, light: true},
                    {name: "Reflection Filter", tag: "ReflectionFilter", type: 1, light: true},
                    {name: "Reflection Raw", tag: "ReflectionRaw", type: 1, light: true},
                    {name: "Refraction Filter", tag: "RefractionFilter", type: 1, light: true},
                    {name: "Refraction Raw", tag: "RefractionRaw", type: 1, light: true},
                    {name: "Subscatter Surface Raw", tag: "SubscatterSurfaceRaw", type: 1, light: true},
                    {name: "Global Illumination Raw", tag: "GIRaw", type: 1, light: true},
                    {name: "Caustics Raw", tag: "CausticsRaw", type: 1, light: true},
                    {name: "Translucency Filter", tag: "TranslucencyFilter", type: 1, light: false},
                    {name: "Transclucency Lighting Raw", tag: "TransclucencyLightingRaw", type: 1, light: false},
                    {name: "Translucency GI Raw", tag: "TranslucencyGIRaw", type: 1, light: false},
                    {name: "World Position", tag: "WorldPosition", type: 2, light: false},
                    {name: "Object Position", tag: "ObjectPosition", type: 2, light: false},
                    {name: "Normals", tag: "Normals", type: 2, light: false},
                    {name: "Bump Normals", tag: "BumpNormals", type: 2, light: false},
                    {name: "Object Bump Normals", tag: "ObjectBumpNormals", type: 2, light: false},
                    {name: "Depth", tag: "Z", type: 2, light: false},
                    {name: "Shadows", tag: "Shadows", type: 2, light: false},
                    {name: "Motion Vectors", tag: "MotionVectors", type: 2, light: false},
                    {name: "Puzzle Matte", tag: "PuzzleMatte", type: 2, light: false},
                    {name: "Ambient Occusion", tag: "AO", type: 3, light: false}]


    var passType =  ["Standard Shading AOV",
                    "Raw Shading AOV",
                    "Utility AOV",
                    "Deprecated AOV"];

    var sequenceData = [], baseName = null, homeFolder = null;



    function exDelay(msec, looped) {
        
        app.scheduleTask("app.project.showWindow(true); app.activate();", msec, looped);
        
    }

    function FilterFilesExt(arg) {

        return arg.name.search("(exr|tif|tiff|jpg|jpeg)$")
    }



    function getFileExt(filename) {

        var ep = filename.lastIndexOf(".");
        return [ep, filename.substr(ep)]
    }



    function getProjItem(proj, itemName) {
        
        //search for first matching name project item 
        
        for (var i = 1; i <= proj.numItems; i++) {

            if (proj.item(i).name == itemName) {
                return proj.item(i);
                break
            }
        }

    }



    function GetFiles(sourceFolder) {


        var myFiles = [];

        if ((sourceFolder.exists) && (sourceFolder instanceof Folder)) {

            try { 

                $.writeln("The folder " + sourceFolder.name + " assigned");
                myFiles = sourceFolder.getFiles(FilterFilesExt).sort();
                
            } catch(err) {

                $.writeln("Some filesystem error: " + sourceFolder.error);
                alert(err.toString());
                return 0
            }   
        } else {

            alert("The specified folder was not found", RSpass2AE.scriptName);
            return 0
        } // if folder exists

        if (myFiles.length > 0) {
        
            $.writeln("Total Files: " + myFiles.length);
            return myFiles

        } else {

            alert("There were no sequence files found in the folder", RSpass2AE.scriptName)
            return 0
        } // if myFiles has files
    } // getfiles()


    function getBaseName(sourceFolder) {


        var sourceFiles = GetFiles(sourceFolder);
        var aovTagPos = -1, counterPos = -1;

        if (sourceFiles.length > 0)  {

            baseName = null; // reset global baseName
            
            for (var i = 0; i < sourceFiles.length; i++) {
                
                aovTagPos = sourceFiles[i].name.indexOf(RSpass2AE.AOVtag); // aov tag not present
                if (aovTagPos != -1) {

                    baseName = sourceFiles[i].name.substring(0, aovTagPos);
                    $.writeln("baseName from no AOV tag filename: " + baseName);
                } 

                counterPos = sourceFiles[i].name.search("\\d{4,}"); // the counter present
                if (counterPos != -1) {

                    if (baseName != null) { // and AOVtag was found too

                        $.writeln("No AOV tag in this filename. This must be the main beauty pass");
                        break

                    } else { // no AOV tag found, getting the new baseName or overwriting (should be the same)

                        baseName = sourceFiles[i].name.substring(0, counterPos);
                        $.writeln("baseName from AOV tagged filename: " + baseName);
                        break
                    }

                } else {

                    break
                }
            } // for

            exDelay(100, 0);
        }// if theres files
    } // getBasename



    function GetData(sourceFolder) {

        var counterPos = -1, sourceFiles = GetFiles(sourceFolder);

        if ((baseName != null) & (sourceFiles.length > 0)) {

            // 1 collecting the sequences
            // 1a strip filenames to pass tags storing to the equal array
            var strippedNames = [], afterNamePos = baseName.length, aovPos;

            for (var i = 0; i < sourceFiles.length; i++) {

                counterPos = sourceFiles[i].name.search("\\d{4,}");
                if (counterPos == -1) counterPos = sourceFiles[i].name.length;
                
                // checking for AOV tag presence right next to the baseName
                aovPos = sourceFiles[i].name.search(RSpass2AE.AOVtag);
                if (aovPos != -1) afterNamePos = aovPos + RSpass2AE.AOVtag.length;
                strippedNames[i] = sourceFiles[i].name.substring(afterNamePos, counterPos);
            }

            // 1b selecting each new stripped name and adding to the list of uniques
            var uniSequences = [];
            uniSequences.push(0);
            $.writeln("Fisrt sequence added: " + strippedNames[0]);

            for (var f = 1; f < sourceFiles.length; f++) {
        
                if (strippedNames[f-1] != strippedNames[f]) {
                    uniSequences.push(f);
                    $.writeln("New sequence found and added: " + strippedNames[f]);
                    f++;
                }
            }

            $.writeln("Total unique sequences found: " + uniSequences.length);

            // 1c classifing the sequences
            var cFlag = false; cCount = 0;

            sequenceData = [];

            for (var s = 0; s < uniSequences.length; s++) {

                cFlag = false;

                if (strippedNames[uniSequences[s]] == "") { // considered default Beauty pass

                    sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: 0, passname: passList[0].name, lightid: -1, lightname: 0});
                    cFlag = true; cCount++;
                    $.writeln(sourceFiles[uniSequences[s]].name + " is " + passList[0].name);

                } else { 

                    for (var p = 0; p < passList.length; p++) {

                        if (strippedNames[uniSequences[s]].indexOf(passList[p].tag) != -1) {

                            sequenceData.push({fileid: uniSequences[s], file: sourceFiles[uniSequences[s]], passid: p, passname: passList[p].name, lightid: -1, lightname: 0});
                            cFlag = true; cCount++;
                            $.writeln(sourceFiles[uniSequences[s]].name + " is " + passList[p].name);
                            break;
                        }
                    }
                }

                if (!cFlag) {

                    $.writeln(sourceFiles[uniSequences[s]].name + " was not classified. Skipping!")
                }
            }

            $.writeln(cCount + " of " + sequenceData.length + " passes were classified");

            // 2 Ligtpass groups processing, if any

            var LightGroup = [], lp;

            for (var s = 0; s < sequenceData.length; s++) {

                lp = strippedNames[sequenceData[s].fileid].split("_");
                if (lp[1] != undefined) {

                    LightGroup.push(lp[1]);
                    sequenceData[s].lightid = LightGroup.length - 1;
                    sequenceData[s].lightname = lp[1];
                    $.writeln(strippedNames[sequenceData[s].fileid] + " assigned to lightgroup " + lp[1]);
                }
            }

            $.writeln(LightGroup.length + " lightgroups detected");

        } // if baseName
        
        return sequenceData    
    } // GetData
    
    

    function importData(sequenceData, FPS) {

        
        var currentProj = app.project, iCount = 0;
        
        if ((currentProj) && (sequenceData.length > 0)) {
        
            $.writeln("Now Importing...");
            var importOptions, importedFile;
            var importHome = currentProj.rootFolder, lightFolders=[];
            if (currentProj.activeItem != null) {

                importHome = (currentProj.activeItem.typeName == "Folder") ? currentProj.activeItem : currentProj.rootFolder
            }

            homeFolder = currentProj.items.addFolder(RSpass2AE.homeFolderName);
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

        } // if current project and data

        return iCount 

    } // importData



    function autoComp(sequenceData) {

        var currentProj = app.project, cCount = 0, newComps = [];

        if ((currentProj) && (sequenceData.length > 0) && (homeFolder != null)) {

            var tItem = sequenceData[0].footage, tLayer;
            compFolder = currentProj.items.addFolder(baseName + " Auto Compositions");
            compFolder.parentFolder = homeFolder;

            //create default comp
            var defComp = currentProj.items.addComp("Main", tItem.width, tItem.height, tItem.pixelAspect, tItem.duration, tItem.frameRate);
            defComp.parentFolder = compFolder;

            for (var s = 0; s < sequenceData.length; s++) {

                if (sequenceData[s].lightid != -1) { // if the footage in a lightgroup
                    
                    if (newComps[sequenceData[s].lightid] == undefined ) { // look if this lightgroup has a comp already

                        newComps[sequenceData[s].lightid] = currentProj.items.addComp(sequenceData[s].lightname, tItem.width, tItem.height, tItem.pixelAspect, tItem.duration, tItem.frameRate);
                        newComps[sequenceData[s].lightid].parentFolder = compFolder;

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

            defComp.openInViewer;

        } // if current project and data

    }


    function buildUI(thisObj){
    
        
        // PALETTE
        var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", RSpass2AE.scriptName + " v" + RSpass2AE.version, undefined, {resizeable: true});    

        if (palette !== null)
        {
            
        }


    } // buildUI


    ////////////////// main
    
    $.writeln("\r--- new run inititated ---\r");

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

    var myFolder = Folder.selectDialog("Select the renderpass folder");
    if (myFolder != null) {

        getBaseName(myFolder);

        if (baseName != null) {

            var seqData = GetData(myFolder); 

            if ((seqData) && (seqData.length > 0)) {

                var filesImported = importData(seqData, 25);
                $.writeln (filesImported + " imported");

                if (filesImported > 0) {

                    var compCreated = autoComp(seqData)
                }

            } else {
            
                //
            }
        
        } //basename check

    } // folder check

    $.writeln((seqData) ? seqData.length : ("sequences found, and " + filesImported + " imported"))
})(this);
