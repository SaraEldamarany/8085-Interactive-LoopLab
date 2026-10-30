/* LoopLab bilingual interface. 100% client-side; no third-party translation service. */
(() => {
  'use strict';
  let language = 'ar';
  const originals = new WeakMap();
  const lastEnglish = new WeakMap();
  const protectedIds = new Set(['codeView', 'codeEditor', 'equation', 'alu']);

  // Longer expressions take priority. Numeric values are kept unchanged.
  const rules = [
    [/^كل ضغطة$/, 'Every press of'],
    [/^بتحرك الأرقام، وتنوّر السطر اللي بيتنفذ، وتشرح$/, 'moves the numbers, highlights the executing line, and explains'],
    [/^ليه المعالج عمل كده$/, 'why the CPU did that'],
    [/^إزاي الـ$/, 'How does the'],
    [/^بتشتغل؟$/, 'work?'],
    [/^افهم الفكرة خطوة بخطوة، مش بالحفظ$/, 'Understand the idea step by step — not by memorizing'],
    [/^إزاي الـ\s*Loop\s*بتشتغل؟$/, 'How does a loop work?'],
    [/^كل ضغطة\s*Next Step\s*بتحرك الأرقام، وتنوّر السطر اللي بيتنفذ، وتشرح\s*ليه المعالج عمل كده\.$/, 'Every Next Step moves the numbers, highlights the instruction, and explains why the CPU does it.'],
    [/^الضرب بالجمع المتكرر$/, 'Multiplication by Repeated Addition'],
    [/^القسمة بالطرح المتكرر$/, 'Division by Repeated Subtraction'],
    [/^الـ Loop والـ Counter$/, 'Loops and Counters'],
    [/^بدل علامة الضرب\.\.\. هنضيف نفس الرقم كل مرة، ونقلّل العداد بعد كل دورة\.$/, 'Instead of multiplying at once, add the same value repeatedly and decrease the counter after each iteration.'],
    [/^كل ما نقدر نطرح المقسوم عليه، نزود عدد المرات مرة\. لما الباقي يصغر نوقف\.$/, 'Every successful subtraction adds one to the quotient. Stop when the remainder becomes smaller than the divisor.'],
    [/^كل مرة هنضيف قيمة صغيرة، ونقلّل عدّاد التكرار لحد ما يوصل صفر\.$/, 'Add a value each time, decreasing the loop counter until it reaches zero.'],
    [/^عدد المرات \(Hex\)$/, 'Number of iterations (Hex)'],
    [/^هنضيف كام؟ \(Hex\)$/, 'Value to add (Hex)'],
    [/^المقسوم \(Hex\)$/, 'Dividend (Hex)'],
    [/^المقسوم عليه \(Hex\)$/, 'Divisor (Hex)'],
    [/^عدد التكرارات \(Hex\)$/, 'Loop count (Hex)'],
    [/^القيمة كل مرة \(Hex\)$/, 'Value per iteration (Hex)'],
    [/^الضرب$/, 'Multiplication'],
    [/^القسمة$/, 'Division'],
    [/^الـ Loop$/, 'Loop'],
    [/^الضرب: (\d+) × (\d+)$/, 'Multiplication: $1 × $2'],
    [/^(\d+) مجموعات، كل مجموعة فيها (\d+)$/, '$1 groups with $2 in each'],
    [/^هنكرر الجمع (\d+) مرات$/, 'Repeat the addition $1 times'],
    [/^(\d+) ÷ (\d+) — نكوّن مجموعات$/, '$1 ÷ $2 — make equal groups'],
    [/^كل مجموعة بتاخد نفس العدد، والباقي بيظهر بعد كل خطوة\.$/, 'Each group gets the same amount; see the remainder after every step.'],
    [/^كل دورة تزوّد الناتج، والعداد يقل واحدة\.$/, 'Each iteration increases the result and decreases the counter.'],
    [/^اضغط Next Step لمتابعة حركة الأرقام$/, 'Press Next Step to watch the numbers move'],
    [/^جاهزين نبدأ!$/, 'Ready to begin!'],
    [/^✓ خلصنا!$/, '✓ Finished!'],
    [/^خطوة (\d+)$/, 'Step $1'],
    [/^اللي حصل لحد دلوقتي$/, 'What happened so far'],
    [/^السرعة$/, 'Speed'],
    [/^بطيء$/, 'Slow'],
    [/^متوسط$/, 'Medium'],
    [/^سريع$/, 'Fast'],
    [/^💡 THE WHY BEHIND THE STEP$/, '💡 THE WHY BEHIND THE STEP'],
    [/^هنبدأ من الصفر!$/, 'Starting from zero!'],
    [/^تابع القيم ثم اضغط Next Step\. كل خطوة بتوضح إيه اللي الـ CPU بينفذه وليه\.$/, 'Follow the values and press Next Step. Each step shows what the CPU executes and why.'],
    [/^شاهد المجموعات والأرقام، واضغط Next Step لمتابعة التنفيذ خطوة بخطوة\.$/, 'Watch the groups and numbers, then press Next Step to follow execution one instruction at a time.'],
    [/^بتتغير لما التعليمات الحسابية تحدّثها$/, 'Updated by arithmetic instructions'],
    [/^الفلوشارت اللي بيتحرك مع التنفيذ$/, 'A flowchart that follows execution'],
    [/^هيتنور الجزء الخاص بالقرار بعد كل تعليمة\.$/, 'The relevant decision step lights up as the program runs.'],
    [/^ابدأ التنفيذ لتظهر كل خطوة مضيئة على الفلوشارت\.$/, 'Start executing to highlight each step on the flowchart.'],
    [/^الـ Registers بتتجهز بالقيم\.$/, 'Registers are being initialized.'],
    [/^الـ ALU بتنفّذ الحساب وتحدّث الـ Flags\.$/, 'The ALU performs the calculation and updates the flags.'],
    [/^العداد اتغير: تابع B أو C\.$/, 'The counter changed: watch B or C.'],
    [/^تعليمة الشرط بتفحص الـ Flags لتختار الطريق\.$/, 'The conditional instruction checks the flags to choose a path.'],
    [/^وصلنا إلى HLT وانتهى التنفيذ\.$/, 'HLT was reached. Execution is complete.'],
    [/^الكود بيتنفذ قدامك$/, 'See the code execute live'],
    [/^✎ تعديل الكود$/, '✎ Edit code'],
    [/^السطر المتظلل يوضح التعليمة الحالية، والـ Registers والفلوشارت بتتحدث أثناء التنفيذ\.$/, 'The highlighted line shows the current instruction. Registers and the flowchart update as it executes.'],
    [/^عدّل تعليمات 8085 ثم اضغط Apply$/, 'Edit the 8085 instructions, then press Apply'],
    [/^↺ رجوع للمثال$/, '↺ Restore example'],
    [/^تعليمات التفرع تعتمد على Flags الفعلية\.$/, 'Branching instructions use the actual flags.'],
    [/^الـ Counter هو اللي بيحدد إمتى نوقف التكرار\.$/, 'The counter determines when the loop stops.'],
    [/^السطر المُظلّل هو التعليمة اللي هتتنفذ بالضغطة الجاية\.$/, 'The highlighted instruction will execute on the next step.'],
    [/^الكود المعدّل بيتنفّذ فعليًا، لكن التشبيه البصري مصمم للمثال المختار\.$/, 'Your edited code executes, while the visual analogy is tailored to the selected example.'],
    [/^توقّع الخطوة الجاية:$/, 'Predict the next step:'],
    [/^لو جمعنا (\d+) مرة كمان، الناتج هيبقى كام؟$/, 'What happens if we add $1 one more time?'],
    [/^✨ مثال مختلف$/, '✨ Try another example'],
    [/^⏭ أكمل للنهاية$/, '⏭ Finish execution'],
    [/^بنجهز القيم في الـ Registers$/, 'Preparing register values'],
    [/^بنعمل نسخة من قيمة$/, 'Copying a value'],
    [/^زودنا الناتج مرة!$/, 'Added to the result!'],
    [/^طرحنا مجموعة كاملة$/, 'Subtracted one full group'],
    [/^الـ CPU بتسأل: ينفع نطرح؟$/, 'The CPU asks: can we subtract?'],
    [/^زوّدنا عدد المرات$/, 'Incremented the count'],
    [/^العداد قلّ واحدة$/, 'Counter decreased by one'],
    [/^لسه فيه تكرارات! ↻$/, 'More iterations! ↻'],
    [/^اللوب خلص!$/, 'Loop completed!'],
    [/^الشرط اتحقق$/, 'Condition met'],
    [/^الشرط لم يتحقق$/, 'Condition not met'],
    [/^الباقي أصغر — نقف$/, 'Remainder is smaller — stop'],
    [/^نقدر نكمل$/, 'We can continue'],
    [/^لا يوجد Carry$/, 'No carry'],
    [/^حصل Carry$/, 'Carry occurred'],
    [/^رجعنا للسؤال تاني$/, 'Back to the decision'],
    [/^برافو! البرنامج خلص 🎉$/, 'Program complete! 🎉'],
    [/^الكود وصل للنهاية$/, 'The code reached its end'],
    [/^تأكد من وجود HLT في نهاية البرنامج\.$/, 'Make sure your program ends with HLT.'],
    [/^تم إيقاف التنفيذ بعد عدد كبير من الخطوات للحماية من Loop لا نهائية\.$/, 'Execution stopped after too many steps to prevent an infinite loop.'],
    [/^لسه مفيش مجموعات$/, 'No groups yet'],
    [/^(\d+) من (\d+) مجموعات اكتملت$/, '$1 out of $2 groups completed'],
    [/^كل مجموعة فيها (\d+) • المجموعات المكتملة = (\d+)$/, 'Each group contains $1 • Completed groups = $2'],
    [/^العداد B$/, 'Counter B'],
    [/^الناتج A$/, 'Result A'],
    [/^الباقي A$/, 'Remainder A'],
    [/^كل مجموعة = (\d+) عناصر • المتبقي = (\d+) مجموعات$/, 'Each group = $1 items • Remaining = $2 groups'],
    [/^الباقي الآن:/, 'Remaining now:'],
    [/^⚠️ القسمة على صفر غير ممكنة$/, '⚠️ Division by zero is undefined'],
    [/^💡 الباقي أصغر من المقسوم عليه؛ مش هنكوّن مجموعة جديدة$/, '💡 The remainder is smaller than the divisor; no more groups can be formed.'],
    [/^لسه نقدر نكوّن مجموعة جديدة لو الباقي ≥ المقسوم عليه$/, 'We can form another group while the remainder ≥ the divisor.'],
    [/^حضّر A = 0 و B = عدد المرات$/, 'Set A = 0 and B = the loop count'],
    [/^اجمع الرقم D داخل A$/, 'Add D into A'],
    [/^قلّل العداد B بواحد$/, 'Decrease counter B by one'],
    [/^هل العداد = صفر؟$/, 'Is the counter zero?'],
    [/^احفظ الناتج وانتهِ$/, 'Finish and keep the result'],
    [/^ابدأ من الصفر وجهّز B$/, 'Start from zero and initialize B'],
    [/^اجمع القيمة في A$/, 'Add the value into A'],
    [/^قلّل B = B - 1$/, 'Decrease B: B = B - 1'],
    [/^هل فيه تكرار تاني؟$/, 'Another iteration?'],
    [/^انتهى التكرار$/, 'The loop has ended'],
    [/^جهّز A و B و C = 0$/, 'Initialize A, B, and C = 0'],
    [/^هل A أصغر من B؟$/, 'Is A smaller than B?'],
    [/^اطرح B من A$/, 'Subtract B from A'],
    [/^زوّد C بواحد$/, 'Increment C by one'],
    [/^خزّن الناتج والباقي$/, 'Keep the quotient and remainder'],
    [/^كم عدد مرات الجمع؟ (\d+) — وهل الناتج صحيح؟$/, 'How many additions? $1 — Is the result correct?'],
    [/^هل (\d+) × (\d+) \+ (\d+) يساوي المقسوم؟$/, 'Does $1 × $2 + $3 equal the dividend?'],
    [/^إيه النتيجة؟$/, 'What is the result?'],
    [/^هل Z = 0؟ هنرجع للوب ولا هنخرج؟$/, 'Is Z = 0? Will the loop repeat or exit?'],
    [/^هل CY = 1؟ هل الباقي أصغر من المقسوم عليه؟$/, 'Is CY = 1? Is the remainder smaller than the divisor?'],
    [/^هل A أقل من B؟ وإيه اللي هيحصل للـ Carry Flag؟$/, 'Is A smaller than B? What will happen to the carry flag?'],
    [/^لو نقصنا B واحد، هل هتبقى صفر؟$/, 'If we decrement B, will it become zero?'],
    [/^لو ضفنا (\d+) إلى A، كام هيبقى الناتج؟$/, 'If we add $1 to A, what will the result be?'],
    [/^لو طرحنا (\d+) من (\d+)، الباقي كام؟$/, 'If we subtract $1 from $2, what remains?'],
    [/^أي Register هتتغير بعد السطر القادم؟$/, 'Which register will change after the next instruction?'],
    // Dynamic instruction explanations, with values captured and preserved.
    [/^حطينا (\w+H) في ([A-Z])\. نقل البيانات لا يغير الـ Flags\.$/, 'Loaded $1 into register $2. Data transfer does not change the flags.'],
    [/^نقلنا نسخة من ([A-Z]) إلى ([A-Z])\. القيمة الأصلية مش بتتمسح\.$/, 'Copied the value from $1 into $2. The original value is preserved.'],
    [/^جمعنا (\w+H) على A اللي كانت (\w+H)\. بقينا (\w+H)\. ظهر Carry لأن الناتج أكبر من FFH\.$/, 'Added $1 to A ($2), giving $3. Carry occurred because the full result exceeds FFH.'],
    [/^جمعنا (\w+H) على A اللي كانت (\w+H)\. بقينا (\w+H)\.$/, 'Added $1 to A ($2), giving $3.'],
    [/^شيلنا (\w+H) من (\w+H)\. الباقي في A = (\w+H)\.$/, 'Subtracted $1 from $2. The new value in A is $3.'],
    [/^A = (\w+H) أقل من (\w+H)، إذن CY=1\. مش هينفع نكوّن مجموعة جديدة\.$/, 'A = $1 is less than $2, so CY = 1. We cannot make another full group.'],
    [/^A = (\w+H) أكبر أو تساوي (\w+H)، إذن CY=0\. نقدر نطرح\. قيمة A نفسها لم تتغير\.$/, 'A = $1 is at least $2, so CY = 0. Subtraction is possible; A itself is unchanged.'],
    [/^زودنا ([A-Z]) من (\w+H) إلى (\w+H)\. INR لا تغير CY\.$/, 'Incremented $1 from $2 to $3. INR does not change CY.'],
    [/^قللنا ([A-Z]) من (\w+H) إلى (\w+H)\. العداد وصل للصفر؛ Zero Flag بقت 1\. DCR لا تغير CY\.$/, 'Decremented $1 from $2 to $3. The counter reached zero, so Z = 1. DCR does not change CY.'],
    [/^قللنا ([A-Z]) من (\w+H) إلى (\w+H)\. العداد لسه مش صفر\. DCR لا تغير CY\.$/, 'Decremented $1 from $2 to $3. The counter is not zero yet. DCR does not change CY.'],
    [/^JNZ بتبص على Z = 0\. Z=0، يبقى نرجع لبداية اللوب\.$/, 'JNZ checks Z = 0. Since Z = 0, jump back to the loop.'],
    [/^JNZ بتبص على Z = 1\. Z=1، يبقى نكمل من غير قفزة\.$/, 'JNZ checks Z = 1. Since Z = 1, continue without jumping.'],
    [/^JZ: Z=(\d)، هنقفز\.$/, 'JZ: Z = $1, so we jump.'],
    [/^JZ: Z=(\d)، هنكمل عادي\.$/, 'JZ: Z = $1, so we continue.'],
    [/^JC: CY=1\. حصل Borrow في المقارنة، فهنقفز للنهاية\.$/, 'JC: CY = 1. The comparison borrowed, so jump to the end.'],
    [/^JC: CY=0\. مفيش Borrow، هنكمل طرح\.$/, 'JC: CY = 0. No borrow; continue subtracting.'],
    [/^JNC: CY=0\. هنقفز\.$/, 'JNC: CY = 0, so we jump.'],
    [/^JNC: CY=1\. هنكمل\.$/, 'JNC: CY = 1, so we continue.'],
    [/^JMP قفزة غير مشروطة\. رجعنا لبداية الحلقة حتى نقارن من جديد\.$/, 'JMP is unconditional. Jump back to the start to compare again.'],
    [/^وصل التنفيذ إلى HLT\. النتيجة النهائية ظاهرة في الـ Registers والمشهد البصري\.$/, 'HLT reached. See the final result in the registers and visual scene.'],
    [/^قيمة مفقودة\.$/, 'A value is missing.'],
    [/^الـ Label (\w+) متكررة\.$/, 'Label $1 is duplicated.'],
    [/^الـ Label (\w+) غير موجودة\.$/, 'Label $1 does not exist.'],
    [/^اكتبي كود في المحرر أولًا\.$/, 'Enter code in the editor first.'],
    [/^Register (\w+) غير مدعومة\.$/, 'Register $1 is not supported.'],
    [/^(\w+) محتاجة Register صحيحة\.$/, '$1 requires a valid register.'],
    [/^سطر (\d+): صيغة غير مفهومة\.$/, 'Line $1: Invalid syntax.'],
    [/^سطر (\d+): التعليمة (\w+) مش مدعومة هنا\.$/, 'Line $1: Instruction $2 is not supported.'],
    [/^سطر (\d+): (\w+) محتاجة (\d+) parameter\(s\)\.$/, 'Line $1: $2 needs $3 parameter(s).'],
    [/^القيمة (\w+) مش 8-bit Hex\. اكتبي رقم من 00H إلى FFH\.$/, 'Value $1 is not 8-bit hex. Enter a value from 00H to FFH.'],
  ];

  function translateArabic(text) {
    const prefix = (text.match(/^\s*/) || [''])[0];
    const suffix = (text.match(/\s*$/) || [''])[0];
    let core = text.trim();
    if (!/[\u0600-\u06FF]/.test(core)) return text;
    for (const [regex, english] of rules) {
      if (regex.test(core)) return prefix + core.replace(regex, english) + suffix;
    }
    // Keep technical terms and values intact while translating smaller explanatory parts.
    const fragments = [
      ['الـ Counter هو اللي بيحدد إمتى نوقف التكرار.', 'The counter determines when the loop stops.'],
      ['تعليمات التفرع تعتمد على Flags الفعلية.', 'Branch instructions depend on actual flags.'],
      ['خطوة', 'Step'], ['مجموعات', 'groups'], ['مجموعة', 'group'], ['عناصر', 'items'],
      ['المتبقي', 'remaining'], ['العداد', 'counter'], ['الناتج', 'result'], ['الباقي', 'remainder'],
    ];
    for (const [ar, en] of fragments) core = core.replaceAll(ar, en);
    return prefix + core + suffix;
  }

  function isProtected(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest('script,style,textarea,pre,code,svg')) return true;
    for (const id of protectedIds) if (parent.closest('#' + id)) return true;
    return false;
  }

  function processTextNode(node) {
    if (isProtected(node)) return;
    const current = node.nodeValue || '';
    if (language === 'en') {
      // When the interpreter re-renders a message, that new Arabic value becomes its source.
      if (lastEnglish.get(node) !== current) originals.set(node, current);
      const source = originals.get(node) || current;
      const translated = translateArabic(source);
      if (current !== translated) node.nodeValue = translated;
      lastEnglish.set(node, translated);
    } else {
      const source = originals.get(node);
      if (source !== undefined && current === lastEnglish.get(node)) node.nodeValue = source;
    }
  }

  function walk(root) {
    if (root.nodeType === Node.TEXT_NODE) { processTextNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches('script,style,textarea,pre,code,svg')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(processTextNode);
  }

  function updateButtons() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? 'LOOPLAB | محاكي 8085 التفاعلي' : 'LOOPLAB | Interactive 8085 Simulator';
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === language;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('.tabs')?.setAttribute('aria-label', language === 'ar' ? 'اختر التجربة' : 'Choose an activity');
    document.getElementById('resetBtn')?.setAttribute('title', language === 'ar' ? 'إعادة من البداية' : 'Restart from the beginning');
  }

  function setLanguage(next) {
    if (!['ar','en'].includes(next)) return;
    language = next;
    updateButtons();
    walk(document.body);
    try { localStorage.setItem('looplab-language', next); } catch(e) {}
  }

  // Observe new text from the real interpreter without restarting or touching registers.
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') processTextNode(record.target);
      else for (const node of record.addedNodes) walk(node);
    }
  });
  observer.observe(document.body, {childList:true,characterData:true,subtree:true});
  document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  let saved = 'ar';
  try { saved = localStorage.getItem('looplab-language') || 'ar'; } catch(e) {}
  setLanguage(saved);
})();
