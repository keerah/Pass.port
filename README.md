# Pass.Port
**Pass.Port** is a scripted tool that comes to the rescue when you need to import a bunch of renderpasses (or just one) into **Adobe After Effects**, it also saves your time on compositing

![image](https://user-images.githubusercontent.com/9025818/152893920-53ce0d57-3a8d-4c39-a713-44ca978ef62e.png)

 ## What it does:
* After clicking the **Browse** button **Pass.Port** analyzes the files in the folder you selected to find their shared name (everything before the `_AOV_` tag, or before the framenumber if the tag is not present), let's name it **Basename**. The one detected will be shown in the Basename field.
* You can manually change the path and the basename fields as required.
* The **Parse** button will rescan the last useful folder for the basename again.
* **AutoComp** option will sort the footage into separate compositions corresponding to the detected lightgroups (if any).
* **Straight Alpha** will switch all footage with alpha to Straight interpretation.
* As a result you will have all the sequences imported and one or a few new comps. It will disable all utility AOVS and move them to the top of the compostition. The assets will be placed into the project folder **Pass.Port - Basename** created inside the folder slected prior the import.
* The script saves all your settings between the sessions.
* **Pass.Port** creates a log file named **pass.port_log.txt** next to your AE project file, or on your desktop if your project is not saved. It contains a log of operations for you and for possible debugging.
* **Pass.Port** Creates 2 undo steps, for the **Footage Import** and one for **AutoComp** stage, so you can undo by one.
* Tested on Windows only.
* **Pass.Port** supports multiple passes of the same type (PuzzleA, PuzzleB, PuzzleNew, etc).

## Limitations (by now):
* It doesn't rebuild your composition by the book yet, but its 100% next feature.
* Doesn't support multi-layered EXRs and do not unfold Cryptomasks into compositions by now.
* Doesn't change any of your files and doesn't access the internet
* Framenumbers must be at least **4 digits long**. It will be much more flexible very soon!
* It has bugs, and I guess a lot of them :)

## Naming the AOVs:

The default Redshift for Cinema 4D AOVs naming system was taken for the reference, so it must work effortlessly for the case. Alternative AOV names (see below) are taken from RS Houdini. Other Rule sets are on the list.

#### An example of Pass.Port compatible naming:

![image](https://user-images.githubusercontent.com/9025818/152895068-3a72bca3-4dc5-45e4-b9ec-63ca74dd5879.png)

The **Basename** for these sequences is **shot1** (all symbols before AOV tag or before the framenumber)
After the AOV tag the `_` symbol separates the renderpass type and the lightgroup name

#### Built-in renderpass name variations:

For each Rule Set you will have one alternative renderpass name. Since there's just one Rule Set yet, you have these options by now:

Default (C4D RS) | Alternative
----------|---------------
Beauty | Beauty
Main | Main
DiffuseLighting | Diff*
SpecularLighting | Spec*
Reflections | Refl*
Refractions | Refr*
SSS | Subsurf*
Caustics | Caust*
Emission | Emissive*
GI | Global*
VolumeLighting | VolLight*
VolumeFogEmission | VolFogEm*
VolumeFogTint | VolFogTint*
Background | BG*
DiffuseFilter | DiffFlt*
DiffuseLightingRaw | DiffRaw*
ReflectionsFilter | ReflFlt*
ReflectionsRaw | ReflRaw*
RefractionsFilter | RefrFlt*
ReflectionsRaw | RefrRaw*
SubsurfaceRaw | SSSRaw*
GIRaw | GlobalRaw*
CausticsRaw | CaustRaw*
TransTint | TransFlt*
TotalTransLightingRaw | TransRaw*
TranslucencyGIRaw | TransGIRaw*
TotalDiffuseLightingRaw | TotalRaw*
P | Pos*
ObjectPosition | ObjPos*
N | Norm*
BumpNormals | BumpNorm*
ObjectBumpNormals | ObjNorm*
ObjectPosition | ObjPos*
ObjectID | ID*
Z | Depth*
Shadows | Shad*
MotionVectors | MV*
PuzzleMatte | Puzzle*
AO | Occlusion*
Custom | Cust*
Cryptomatte | Crypto*
IDsAndCoverage | Coverage*

#### A tip for consistent basename with C4D:

Use tokens for main output: `.../$take/$take`, and for RS AOVs: `$take_AOV`

Or, main: `.../$camera/$camera`, AOVs: `$camera_AOV`

**Pass.port** will recognise this naming very gladly

## Usage
You can run **Pass.Port** as usual using **Run Script menu**, or place it into **...Support Files\Scripts\ScriptUI Panels** to be able to dock it into your AE interface

## Development Roadmap

This is [the way](https://github.com/keerah/Pass.port/discussions/3)

I appreciate your contribution to the development

here on GitHub in [Issues](https://github.com/keerah/Pass.port/issues) or [Dicussions](https://github.com/keerah/Pass.port/discussions)

or by donating on [Gumroad](https://gumroad.com/l/PassPort)

or giving feedback on Pass.Port's [Discord channel](https://discord.gg/5WhSsE2T)
