# Pass.Port
![menu img](https://i.imgur.com/zzlOsnc.png "Pass.Port interface")

 ## What it does:
* After clicking BROWSE it analyses the files in the folder you browsed to and finds their shared name (stripped off of everything after the separator tag), it's called Basename
* Once its done you can push the PORT button. It will import all found sequences, analyse them for a renderpass type (this is for future feature of auto compositing by the book) and for Light Groups
* Then if AutoComp enabled, it sortes them into separate Comps corresponding to the detected Light Groups
* As a result you have all sequences imported and one or a few new comps, all placed into the project folder RS render passes
* The script saves all your current settings - the separator tag, fps, autocomp checkbox and the last successful folder location between sessions
* For precise control Pass.port creates a text log file with everything it has found and done named pass.port_log.txt next to your AE project file or to your desktop, if your project is not saved
* Creates 2 undo groups, one for the Footage Import and another one for AutoComp stage, so you can undo by one

## What it does not (yet):
* Doesn't rebuild your composition by the book yet, but its 100% next feature
* Doesn't support multilayered exrs by now
* The parsing is built for the default renderpass naming of C4D Redshift version only (with some variations), other Rule sets are on the list
* Tested on Windows only, cannot promise if it'll work on Mac
* Doesn't change any of your files and does not access the internet
* Unfortunately it will never be able to make you a coffee

You can run it as usual with the Run Script menu, or place it into ...Support Files\Scripts\ScriptUI Panels to be able to dock it into your AE interface. It is a free script, but please do not sell it and do not include it in any products free or paid.

## Naming the renderpases:
A tip for getting a consistent basename for your main render and passes with takes in c4d:

for main output: `.../$take/$take`

for RS AOVs: `$take_AOV`

Or with the $camera token in the same manner. Pass.port will recognise this naming very gladly

## Feedback
If you're actively using Pass.Port and have some feedback/issues please keep in touch with the dedicated discord channel at https://discord.gg/5WhSsE2T