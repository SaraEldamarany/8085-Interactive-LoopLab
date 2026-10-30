# LOOPLAB — Intel 8085 Interactive Loop Visualizer

An interactive, bilingual (Arabic/English) learning experience for Intel 8085 assembly loops, repeated-addition multiplication, and repeated-subtraction division.

## Features

- **AR / EN language switch in the top-left corner.** Switch at any point without resetting the simulation or changing the assembly source code. The interface uses right-to-left layout for Arabic and left-to-right for English.
- Animated visual groups and counters for loops, multiplication, and division.
- Live registers (A, B, C, D, E, H, L), five 8085 flags (S, Z, AC, P, CY), and ALU operation details.
- Flowchart states that highlight the current step, plus highlighted assembly instructions.
- Next Step, Auto Play, Reset, speed control, and editable assembly code with real execution for the supported instructions.
- Pure client-side HTML/CSS/JavaScript; no servers, keys, or packages needed.

## Get started

1. Download all five files to the same directory: `index.html`, `style.css`, `script.js`, `i18n.js`, and `README.md`.
2. Open `index.html` in a modern browser.
3. Select Multiplication, Division, or Loop, change the example inputs, and choose **Next Step**.
4. Use the **العربية / English** toggle in the upper-left to switch languages.
5. Use **Edit code** to modify the example, then **Apply & Restart** to compile your changes.


## Limitations

This is an educational instruction subset simulator, not a full 8085 emulator. The built-in multiplication and loop examples use 8-bit accumulator results (overflows are visible through flags). A division example assumes a nonzero divisor. The graphical analogies are designed for the selected built-in task; user-edited assembly runs but may not perfectly correspond to the original illustration.
