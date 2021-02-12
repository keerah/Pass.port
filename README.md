# Pass.Port
**Pass.Port** is a scripted tool that comes to the rescue when you need to import a bunch of renderpasses (or just one) into **Adobe After Effects**, it also saves your time on compositing

![menu img](https://i.imgur.com/zzlOsnc.png "Pass.Port interface")

 ## What it does:
* After clicking the **Browse** button **Pass.Port** analyzes the files in the folder you selected to find their shared name (everything before the `_AOV_` tag, or before the framenumber if the tag is not present), let's name it **Basename**. The one detected will be shown in the Basename field
* If **Pass.Port** was able to detect the Basename it enables the **Port** button. Click it to import all found sequences and to analyze them for the renderpass type (for the future feature of auto compositing) and for the lightgroups
* Then if the **AutoComp** is checked it will sort the footage into separate compositions corresponding to the detected lightgroups
* As a result you have all sequences imported and one or a few new comps, all placed into the project folder **RS render passes** created inside currently selected project folder
* The script saves all your current settings between the sessions including the last successful folder
* **Pass.Port** creates a log file named **pass.port_log.txt** next to your AE project file, or on your desktop if your project is not saved. It contains all the actions and results of the job
* Creates 2 undo steps, for the **Footage Import** and for **AutoComp** stage, so you can undo by one

## What it does not (yet):
* Doesn't rebuild your composition by the book yet, but its 100% next feature
* Doesn't support multi-layered EXRs by now
* Parsing is built based on the default renderpass naming of C4D Redshift (with some freedom). Other Rule sets are on the list, but as long as you comply to the same rules you can use **Pass.Port** with any other render engine
* Tested on Windows only, cannot promise if it'll work on Mac yet
* Doesn't change any of your files and doesn't access the internet

## Naming the renderpasses:

The default C4D Redshift renderpasses naming system was taken for the reference, so it must work effortlessly for the case. Some alternative passnames (see below) are taken from RS Houdini, so it should also work fine for it

#### An example of Pass.Port compatible naming:

![menu img](https://i.imgur.com/jnj5JBs.png "Naming the passes")

The `_` symbol separates tags inside the filename, and the `_AOV_` (this you can change in the UI) divides the basename from the following renderpass name and lightgroup name tags. If `_AOV_` tag is not present **Pass.Port** will use entire name without framenumber.

The **framenumbers must always be at least 4 digits long**

As you can see on the picture above **Pass.Port** supports multiple passes of the same type (PuzzleA, PuzzleB, PuzzleNew, etc). Just avoid numbers in their names, and the script will handle them well

#### Built-in renderpass name variations:

For each Rule Set you will have one alternative renderpass name. Since there's just one Rule Set yet, you have these options by now:

Default (C4D RS) | Alternative
----------|---------------
Diffuse | Diff
Speculars | Spec
Reflections | Reflect
Refractions | Refract
SSS | Subsurface
Caustics | Caust
Emission | Emissive
GI | Global
VolumeLighting | VolLight
VolumeFogEmission | VolFogEm
VolumeFogTint | VolFogTint
Background | BG
DiffuseFilter | DiffFlt
DiffuseLightingRaw | DiffRaw
ReflectionFilter | ReflFlt
ReflectionRaw | ReflRaw
RefractionFilter | RefrFlt
ReflectionRaw | RefrRaw
SubscatterSurfaceRaw | SSSRaw
GIRaw | GlobalRaw
CausticsRaw | CaustRaw
TransTint | TransFlt
TotalTransLightingRaw | TransRaw
TranslucencyGIRaw | TransGIRaw
WorldPosition | WorldPos
ObjectPosition | ObjPos
Normals | Norm
BumpNormals | BumpNorm
ObjectBumpNormals | ObjNorm
Z | Depth
Shadows | Shadow
MotionVectors | MV
PuzzleMatte | Puzzle
AO | Occlusion

#### A tip for consistent basename with C4D:

Use tokens for main output: `.../$take/$take`, and for RS AOVs: `$take_AOV`

Or, main: `.../$camera/$camera`, AOVs: `$camera_AOV`

**Pass.port** will recognise this naming very gladly

## Usage and Feedback
You can run **Pass.Port** as usual using **Run Script menu**, or place it into **...Support Files\Scripts\ScriptUI Panels** to be able to dock it into your AE interface

If you're actively using **Pass.Port** and have some feedback/issues please keep in touch using the dedicated discord channel at https://discord.gg/5WhSsE2T