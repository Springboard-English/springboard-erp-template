// The boot screen's script (see boot.css). Loaded as a blocking file in
// <head>, not inline, so a strict script-src needs no exception. It runs
// before the first paint and does three things:
//
// 1. Applies the stored colour mode, so a dark-mode user isn't flashed white.
// 2. Builds the guilloche: dotted waves whose dots and dashes spell a short
//    message in Morse. The message is the day's, not random: the accounts site
//    is another origin and can't share a pick, but both sides can agree on
//    today, so the pattern doesn't change on the hop from consent to the app.
//    A few dates (OCCASIONS) redraw it with their own message and shape.
// 3. A failsafe. DashboardLayout dismisses the screen as it mounts, and the
//    OIDC callback holds it while it works; a page that is neither (a public
//    page, an error) would otherwise sit under it forever.
/* global document, window, localStorage, MutationObserver */
(function () {
  var root = document.documentElement;

  var mode;
  try {
    mode = localStorage.getItem("app-color-mode");
  } catch {
    // Storage blocked: follow the system.
  }
  if (mode !== "light" && mode !== "dark") {
    mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.classList.toggle("dark", mode === "dark");

  var MESSAGES = [
    "KEEP GOING",
    "YOU GOT THIS",
    "WELCOME BACK",
    "PRACTICE DAILY",
    "SPEAK UP",
    "ONE WORD AT A TIME",
    "NEVER STOP LEARNING",
    "MISTAKES ARE PROGRESS",
  ];
  var MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
    I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
    Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
  };
  // Days that redraw the backdrop: their own message, wave shape and colours
  // (boot.css reads data-sb-occasion). Keyed by month-day in Vietnam's time.
  var OCCASIONS = {
    "10-20": { name: "womens-day", message: "HAPPY WOMENS DAY", amplitude: 56, period: 224 },
    "11-20": { name: "teachers-day", message: "THANK YOU TEACHERS", amplitude: 18, period: 448 },
  };
  var UNIT = 2;
  var ROW = 14;
  var HEIGHT = 112;
  var STAGGER = 4;

  // Vietnam's time zone, so everything turns over at midnight there.
  var now = new Date(Date.now() + 7 * 3600 * 1000);
  var day = Math.floor(now.getTime() / 86400000);
  var monthDay = ("0" + (now.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + now.getUTCDate()).slice(-2);
  var occasion = OCCASIONS[monthDay];
  // ?sb-occasion=womens-day previews one on any day.
  var preview = /[?&]sb-occasion=([\w-]+)/.exec(window.location.search);
  if (preview) {
    for (var key in OCCASIONS) if (OCCASIONS[key].name === preview[1]) occasion = OCCASIONS[key];
  }
  if (occasion) root.dataset.sbOccasion = occasion.name;
  var PERIOD = occasion ? occasion.period : 320;
  var AMPLITUDE = occasion ? occasion.amplitude : 36;
  var words = (occasion ? occasion.message : MESSAGES[day % MESSAGES.length]).split(" ");

  // A dot is 1 unit lit, a dash 3; 1 dark between marks, 3 between letters,
  // 7 between words and before the message repeats.
  var units = [];
  for (var w = 0; w < words.length; w += 1) {
    for (var c = 0; c < words[w].length; c += 1) {
      var marks = MORSE[words[w][c]];
      for (var m = 0; m < marks.length; m += 1) {
        for (var i = 0; i < (marks[m] === "-" ? 3 : 1); i += 1) units.push(1);
        units.push(0);
      }
      units.push(0, 0);
    }
    units.push(0, 0, 0, 0);
  }
  // Pad to whole waves, so a tile of the message is also a tile of the wave.
  while ((units.length * UNIT) % PERIOD) units.push(0);
  var length = units.length;
  var width = length * UNIT;

  var dashes = [];
  var run = 1;
  for (var u = 1; u <= length; u += 1) {
    if (u < length && units[u] === units[u - 1]) run += 1;
    else {
      dashes.push(run);
      run = 1;
    }
  }

  // Enough rows past each edge that a tall wave still fills the tile.
  var margin = Math.ceil(AMPLITUDE / ROW) + 1;
  var paths = "";
  for (var family = -1; family <= 1; family += 2) {
    for (var row = -margin; row <= HEIGHT / ROW + margin; row += 1) {
      var y = row * ROW;
      var d = "M0 " + y + "Q" + PERIOD / 4 + " " + (y + family * AMPLITUDE) + " " + PERIOD / 2 + " " + y;
      for (var x = PERIOD; x <= width; x += PERIOD / 2) d += "T" + x + " " + y;
      var shift = (((row % STAGGER) + STAGGER) % STAGGER) * Math.round(length / STAGGER);
      paths += '<path pathLength="' + length + '" stroke-dashoffset="' + shift + '" d="' + d + '"/>';
    }
  }
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + HEIGHT + '">' +
    '<g fill="none" stroke="#000" stroke-width="1" stroke-dasharray="' + dashes.join(" ") + '">' +
    paths + "</g></svg>";
  root.style.setProperty("--guilloche-mask", 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  root.style.setProperty("--guilloche-size", width + "px " + HEIGHT + "px");

  // The failsafe. Waits for the body, since this runs in <head>.
  document.addEventListener("DOMContentLoaded", function () {
    var boot = document.getElementById("sb-boot");
    var app = document.getElementById("root");
    if (!boot || !app) return;
    var timer = null;
    var check = function () {
      if (!boot.isConnected) {
        observer.disconnect();
        return;
      }
      if (timer || !app.firstElementChild) return;
      // Long enough for the callback to take its hold and for DashboardLayout
      // to mount after a lazy chunk; a page that is neither gets a plain fade.
      timer = window.setTimeout(function () {
        timer = null;
        if (boot.isConnected && !Number(boot.dataset.holds || 0)) {
          boot.classList.add("sbb-leaving");
          window.setTimeout(function () {
            boot.remove();
          }, 700);
        } else {
          check();
        }
      }, 1500);
    };
    var observer = new MutationObserver(check);
    observer.observe(app, { childList: true });
    check();
  });
})();
