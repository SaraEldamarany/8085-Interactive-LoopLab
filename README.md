# LOOPLAB — Interactive Intel 8085 Loops, Multiplication & Division

An Arabic-first visual learning website for anyone learning Intel 8085 assembly language. Watch repeated addition, repeated subtraction, and counter-controlled loops as animated groups, while the relevant assembly instruction, registers, ALU calculation, flags, and flowchart update step by step.

## Features

- Three guided scenarios: repeated-addition multiplication, repeated-subtraction division, and counter-controlled loops.
- Editable hexadecimal inputs (00–FF), examples, Step, Auto Play, Pause, Reset, and complete execution.
- Visual tokens, completed groups, counters, and live arithmetic equations.
- Live highlighting of assembly source lines, registers and changed flags.
- Flowchart and contextual Arabic narration and questions.
- Built-in editor for supported Intel 8085 instructions and branch labels; **Apply & Restart** runs the edited program in the simulator.
- Responsive user interface; no backend required.

## Run locally

Open `index.html` in your browser. All essential styles and scripts are local. The optional web font may fall back to an installed font when offline.



## Important limitations

This is a **visual, subset 8085 simulator**, not a full Intel 8085 emulator. It supports `MVI`, `MOV`, `ADD`, `ADI`, `SUB`, `SUI`, `CMP`, `CPI`, `INR`, `DCR`, `JMP`, `JC`, `JNC`, `JZ`, `JNZ`, and `HLT`, with an instruction-count safety limit. Some machine details (instruction bytes, memory, exact PC addresses, timing, stack and I/O) are intentionally out of scope.

The guided multiplication example demonstrates an **8-bit accumulator result**. It is best used with products 0–255. For larger products, it shows the 8-bit truncation and CY but does **not** preserve a full 16-bit product. The prebuilt loop demonstrations assume a nonzero count. Division by zero is invalid. When custom code is edited, the interpreter executes the updated instructions, but the decorative grouping visualization remains tied to the selected learning scenario, so arbitrary custom code may not correspond to the pictured groups.

## Educational model

The key idea is that multiplication can be implemented as repeated addition, while integer division can be implemented as repeated subtraction. The CPU's branch instructions read condition flags to decide when to continue or stop a loop. This makes the relationship between `DCR`, `JNZ`, `CMP`, `JC`, the registers, and the ALU visible.
