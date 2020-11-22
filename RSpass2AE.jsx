// RSpass2AE by Keerah
// prototype ver 0.1

(function RSpass2AE(thisObj) {

    var RSpass2AE =  new Object;
        RSpass2AE.scriptName = "RS passes to AE";
        RSpass2AE.version = "0.11";
        RSpass2AE.AOVtag = "_AOV_";

    var PassList = [{name: "Beauty", tag: "Beauty", type: 0, light: false},
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


    var PassType =  ["Standard Shading AOV",
                    "Raw Shading AOV",
                    "Utility AOV",
                    "Deprecated AOV"];

    var SequenceData = [];

    $.writeln("\r--- new run inititated ---\r")



    function FilterFilesExt(arg) {

        return arg.name.search("(exr|tif|tiff|jpg|jpeg)$")
    }



    function getFileExt(filename) {

        var ep = filename.lastIndexOf(".");
        return [ep, filename.substr(ep)]
    }



    function GetFiles(FolderName) {


        var SourceFolder = new Folder(FolderName), MyFiles = [[],];

        if ((SourceFolder.exists) && (SourceFolder instanceof Folder)) {

            try { 

                $.writeln("The folder " + SourceFolder.name + " assigned");
                MyFiles = SourceFolder.getFiles(FilterFilesExt).sort();
                
            } catch(err) {

                $.writeln("Some filesystem error: " + SourceFolder.error);
                alert(err.toString());
                return null
            }   
        } else {

            alert("The specified folder was not found", RSpass2AE.scriptName);
            return null
        } // if folder exists

        if (MyFiles.length > 0) {
        
            $.writeln("Total Files: " + MyFiles.length);
            return MyFiles

        } else {

            alert("There were no sequence files found in the folder", RSpass2AE.scriptName)
            return null
        } // if MyFiles has files
    } // getfiles()


    function GetBaseName(FolderName) {


        var BaseName = null, SourceFiles = GetFiles(FolderName);
        var AOVTagPos = -1, CounterPos = -1;
        
            if (SourceFiles)  {
        
                // parse files for BaseName 
                
                for (var i = 0; i < SourceFiles.length; i++) {
                    
                    AOVTagPos = SourceFiles[i].name.indexOf(RSpass2AE.AOVtag); // aov tag not present
                    if (AOVTagPos != -1) {

                        BaseName = SourceFiles[i].name.substring(0, AOVTagPos);
                        $.writeln("BaseName from no AOV tag filename: " + BaseName);
                    } 

                    CounterPos = SourceFiles[i].name.search("\\d{4,}"); // the counter present
                    if (CounterPos != -1) {

                        if (BaseName != null) { // and AOVtag was found too

                            $.writeln("No AOV tag in this filename. This must be the main beauty pass");
                            break

                        } else { // no AOV tag found, getting the new BaseName or overwriting (should be the same)

                            BaseName = SourceFiles[i].name.substring(0, CounterPos);
                            $.writeln("BaseName from AOV tagged filename: " + BaseName);
                            break
                        }

                    } else {

                        break
                    }
                } // for
            }// if theres files
            
        return BaseName

    }



    function GetData(FolderName) {


        var BaseName = GetBaseName(FolderName), SourceFiles = GetFiles(FolderName);
        var CounterPos = -1;

        if ((BaseName != null) & (SourceFiles.length > 0)) {

            // 1 collecting the sequences
            // 1a strip filenames to pass tags storing to the equal array
            var StrippedNames = [], AfterNamePos = BaseName.length, AOVPos;

            for (var i = 0; i < SourceFiles.length; i++) {

                CounterPos = SourceFiles[i].name.search("\\d{4,}");
                if (CounterPos == -1) CounterPos = SourceFiles[i].name.length;
                
                // checking for AOV tag presence right next to the BaseName
                AOVPos = SourceFiles[i].name.search(RSpass2AE.AOVtag);
                if (AOVPos != -1) AfterNamePos = AOVPos + RSpass2AE.AOVtag.length;
                StrippedNames[i] = SourceFiles[i].name.substring(AfterNamePos, CounterPos);
            }

            // 1b selecting each new stripped name and adding to the list of uniques
            var UniSequences = [];
            UniSequences.push(0);
            $.writeln("Fisrt sequence added: " + StrippedNames[0]);

            for (var f = 1; f < SourceFiles.length; f++) {
        
                if (StrippedNames[f-1] != StrippedNames[f]) {
                    UniSequences.push(f);
                    $.writeln("New sequence found and added: " + StrippedNames[f]);
                    f++;
                }
            }

            $.writeln("Total unique sequences found: " + UniSequences.length);

            // 1c classifing the sequences
            var CFlag = false; CCount = 0;

            SequenceData = [];

            for (var s = 0; s < UniSequences.length; s++) {

                CFlag = false;

                if (StrippedNames[UniSequences[s]] == "") { // considered default Beauty pass

                    SequenceData.push({id: UniSequences[s], PassId: 0, light: 0});
                    CFlag = true; CCount++;
                    $.writeln(SourceFiles[UniSequences[s]].name + " is " + PassList[0].name);

                } else { 

                    for (var p = 0; p < PassList.length; p++) {

                        if (StrippedNames[UniSequences[s]].indexOf(PassList[p].tag) != -1) {

                            SequenceData.push({id: UniSequences[s], PassId: p, light: 0});
                            CFlag = true; CCount++;
                            $.writeln(SourceFiles[UniSequences[s]].name + " is " + PassList[p].name);
                            break;
                        }
                    }
                }

                if (!CFlag) {

                    $.writeln(SourceFiles[UniSequences[s]].name + " was not classified. Skipping!")
                }
            }

            $.writeln(CCount + " of " + SequenceData.length + " passes were classified");


            // 2 Ligtpass groups processing, if any

            var LightGroup = [], lp;

            for (var s = 0; s < SequenceData.length; s++) {

                lp = StrippedNames[SequenceData[s].id].split("_");
                if (lp[1] != undefined) {

                    LightGroup.push(lp[1]);
                    SequenceData[s].light = LightGroup.length - 1;
                    $.writeln(StrippedNames[SequenceData[s].id] + " assigned to lightgroup " + lp[1]);
                }
            }

            $.writeln(LightGroup.length + " lightgroups detected");

        } // if BaseName
        
        return SequenceData    
    } // GetData
    
    

    function ImportData(SequenceData) {

        
        var Proj = app.thisproject, Home = (Proj.activeItem.typeName == "Folder") ? Proj.activeItem : Proj.root

        var importOptions = new ImportOptions(files[index]);
        importOptions.sequence = true;
        
        var importedFile = Proj.importFile(importOptions);
		importedFile.parentFolder = selectedFolder;
		importedFile.mainSource.conformFrameRate = FPS;



    } // ImportData function



    function buildUI(thisObj){
    
        
        // PALETTE
        var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", RSpass2AE.scriptName + " v" + RSpass2AE.version, undefined, {resizeable: true});    

        if (palette !== null)
        {
            
        }


    } // buildUI


    // main
    
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


    var MyFolder = "D:\\keerah\\PROJECTS\\00\\Front1\\";
    var SeqData = GetData(MyFolder);
    
    return (SeqData) ? SeqData.length : "nothing's done"


})(this);