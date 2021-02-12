# Pass.Port
**Pass.Port** is a scripted tool that comes to the rescue when you need to import a bunch of renderpasses (or just one) into **Adobe After Effects** and saves your time on compositing

![menu img](https://i.imgur.com/zzlOsnc.png "Pass.Port interface")

 ## What it does:
* After clicking the **Browse** button **Pass.Port** analyses the files in the folder you selected to find their shared name (stripped off of everything after the separator tag), it's called **Basename**. The one detected will be shown in the Basename field
* If **Pass.Port** is able to detect the Basename, it will enable the **Port** button. Clicking it will import all found sequences, analyse them for the renderpass type (this is for the future feature of auto compositing) and for the Light Groups
* Then if **AutoComp** is checked, it will sort the footage into separate compositions corresponding to the detected Light Groups
* As a result you have all sequences imported and one or a few new comps, all placed into the project folder **RS render passes** created inside currently selected project folder. **Pass.port** will indicate this in its UI (and in the log file)
* The script saves all your current settings between the sessions, including the last successful folder
* **Pass.Port** creates a text log file with everything it has found and done named **pass.port_log.txt** next to your AE project file, or to your desktop if your project is not saved
* Creates 2 undo groups, one for the **Footage Import** and another one for **AutoComp** stage, so you can undo by one

## What it does not (yet):
* Doesn't rebuild your composition by the book yet, but its 100% next feature
* Doesn't support multilayered exrs by now
* The parsing is built for the default renderpass naming of C4D Redshift version only (with some variations), other Rule sets are on the list. But as long as you comply to the same rules you can use it with any other render engine
* Tested on Windows only, cannot promise if it'll work on Mac
* Doesn't change any of your files and does not access the internet
* Unfortunately it will never be able to make you a coffee

## Naming the renderpasses:

Example of Pass.Port compatible naming:

![menu img](https://i.imgur.com/jnj5JBs.png "Naming the passes")

The `_` symbol separates tags inside the filename, and the `_AOV_` (this you can change) divides the basename from the following renderpass name and light group name tags (or the frame number if this tag is not present).

A tip for getting a consistent basename for your main render and passes with takes in c4d with tokens:

for main output: `.../$take/$take`

for RS AOVs: `$take_AOV`

Or with the **$camera** token in the same manner. **Pass.port** will recognise this naming very gladly

## Usage and Feedback
You can run **Pass.Port** as usual using the **Run Script menu**, or place it into **...Support Files\Scripts\ScriptUI Panels** to be able to dock it into your AE interface

It is a free script, but please do not sell it and do not include it in any products free or paid

If you're actively using **Pass.Port** and have some feedback/issues please keep in touch with the dedicated discord channel at https://discord.gg/5WhSsE2T
