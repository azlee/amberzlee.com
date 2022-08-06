// define team members
const TEAM_MEMBERS = {
  DASH: ["Amber", "Barak", "Emma", "Erin", "Ian", "Jesse", "Michael"],
  INFRA: ["Chris", "Derek", "Erin", "Eva", "Harnoor", "Mike K", "Ryan", "Xiao"],
  TAG: [
    "Alex",
    "Chris",
    "Christina",
    "Daphne",
    "Erin",
    "Jessie",
    "Joan",
    "Justin",
    "Scott",
    "Steefan",
    "Xiao",
  ],
  "All teams": [
    "Alex",
    "Amber",
    "Barak",
    "Chris",
    "Christina",
    "Daphne",
    "Derek",
    "Emma",
    "Erin",
    "Eva",
    "Harnoor",
    "Ian",
    "Jesse",
    "Jessie",
    "Joan",
    "Justin",
    "Michael",
    "Mike K",
    "Ryan",
    "Sagnik",
    "Scott",
    "Steefan",
    "Xiao",
  ],
};
let squad = "DASH";

let padding = { top: 20, right: 40, bottom: 0, left: 0 },
  w = 725 - padding.left - padding.right,
  h = 725 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [];

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Convert HSL to RGB
 * @param {Number} h hue
 * @param {Number} s saturation
 * @param {Number} l lightness
 */
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return rgbToHex(r, g, b);
}

/**
 * Generate colors based on HSL
 * @param {Number} numColors
 */
function generateColors(numColors) {
  let c = [];
  for (let i = 0; i < numColors; ++i) {
    c.push(hslToRgb(i / numColors, 0.85, 0.65));
  }
  return c;
}

/**
 * Refresh the spinner with the checked team members
 */
function refreshSpinner() {
  const checkedMembers = [
    ...document.querySelectorAll(".checkboxInput:checked"),
  ].map((e) => e.name);
  generateSpinner(checkedMembers);
}

function createTeamMemberSelect(teamMember) {
  const div = document.createElement("div");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = teamMember;
  input.name = teamMember;
  input.checked = true;
  input.classList = "checkboxInput";
  input.onchange = function () {
    refreshSpinner();
  };
  const label = document.createElement("label");
  label.htmlFor = teamMember;
  label.innerText = teamMember;
  div.appendChild(input);
  div.appendChild(label);
  return div;
}

/**
 * Generate the checkbox select list
 * @param {String[]} teamMembers
 */
function generateSelectList(teamMembers) {
  const checkbox = document.getElementById("checkbox");
  checkbox.innerHTML = "";
  for (const teamMember of teamMembers) {
    const div = createTeamMemberSelect(teamMember);
    checkbox.appendChild(div);
  }
  const teamMemberInput = document.getElementById("teamMemberInput");
  const addButton = document.getElementById("addTeamMemberButton");
  addButton.innerHTML = "Add team member";
  addButton.onclick = () => {
    const name = teamMemberInput.value;
    if (name !== "") {
      console.log("add " + name);
      const div = createTeamMemberSelect(name);
      checkbox.appendChild(div);
      TEAM_MEMBERS[squad].push(name);
      refreshSpinner();
      teamMemberInput.value = "";
    }
  };
}

/**
 * Generate a spinner for the team
 * @param {String[]} teamMembers
 */
function generateSpinner(teamMembers) {
  // clear spinner
  const chart = document.getElementById("chart");
  chart.innerHTML = "";
  const chosen = document.getElementById("chosenPerson");
  chosen.classList.remove("fadeInLeft");
  chosen.innerHTML = "";
  let i = 1;
  const colors = generateColors(teamMembers.length);
  let data = teamMembers.map((name) => {
    i++;
    return {
      name,
      value: i,
    };
  });
  let svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  let container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
      "transform",
      "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );
  let vis = container.append("g");

  let pie = d3.layout
    .pie()
    .sort(null)
    .value(function (d) {
      return 1;
    });
  // declare an arc generator function
  let arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  let arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs
    .append("path")
    .attr("fill", function (d, i) {
      return colors[i];
    })
    .attr("d", function (d) {
      return arc(d);
    })
    .attr("stroke", "#444");
  // add the text
  arcs
    .append("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 30) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .style({ fill: "white" })
    .attr("font-weight", "800")
    .style({ "font-size": teamMembers.length > 15 ? "28px" : "38px" })
    .text(function (d, i) {
      return data[i].name;
    });
  container.on("click", spin);
  function spin() {
    d3.select("#chosenPerson")[0][0].style.opacity = 0;
    d3.select("#chosenPerson")[0][0].style.transform = "translate(80px)";
    setTimeout(() => {
      d3.select("#chosenPerson")[0][0].style.transform = "translate(-80px)";
    }, 400);
    container.on("click", null);
    if (oldpick.length == data.length) {
      container.on("click", null);
      return;
    }
    let ps = 360 / data.length,
      rng = Math.floor(Math.random() * 1440 + 360);

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;
    if (oldpick.indexOf(picked) !== -1) {
      d3.select(this).call(spin);
      return;
    } else {
      oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis
      .transition()
      .duration(3000)
      .attrTween("transform", rotTween)
      .each("end", function () {
        //populate name of chosen person
        d3.select("#chosenPerson").text(data[picked].name);
        d3.select("#chosenPerson")[0][0].style.opacity = 1;
        d3.select("#chosenPerson")[0][0].style.transform = "translate(0)";
        oldrotation = rotation;
        container.on("click", spin);
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
        };

        function fire(particleRatio, opts) {
          confetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
            })
          );
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        fire(0.1, {
          spread: 150,
          startVelocity: 45,
        });
        fire(0.4, {
          spread: 200,
          startVelocity: 55,
        });
      });
  }
  //make arrow
  svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style({ fill: "black" });
  //draw spin circle
  container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 50)
    .style({ fill: "white", cursor: "pointer" })
    .attr("stroke", "#444");
}

generateSpinner(TEAM_MEMBERS[squad]);
generateSelectList(TEAM_MEMBERS[squad]);

function rotTween() {
  let i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function getRandomNumbers() {
  let array = new Uint16Array(1000);
  if (
    window.hasOwnProperty("crypto") &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 1000; i++) {
      array[i] = Math.floor(Math.random() * 100000) + 1;
    }
  }
  return array;
}

/*
 *
 * SELECT DROPDOWN
 *
 */
let select, i, j, l, ll, selElmnt, selectDiv, optionsDiv, option;
select = document.getElementsByClassName("custom-select");
l = select.length;
for (i = 0; i < l; i++) {
  selElmnt = select[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  // for each element, create a new div that will act as the selected item
  selectDiv = document.createElement("div");
  selectDiv.setAttribute("class", "select-selected");
  selectDiv.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  select[i].appendChild(selectDiv);
  // for each element, create a new DIV that will contain the option list
  optionsDiv = document.createElement("div");
  optionsDiv.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    // for each option in the original select element,
    // create a new DIV that will act as an option item
    option = document.createElement("div");
    option.innerHTML = selElmnt.options[j].innerHTML;
    option.addEventListener("click", function (e) {
      // update the chart
      squad = this.innerHTML;
      generateSpinner(TEAM_MEMBERS[squad]);
      generateSelectList(TEAM_MEMBERS[squad]);
      // when an item is clicked, update the original select box,
      // and the selected item
      let y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    optionsDiv.appendChild(option);
  }
  select[i].appendChild(optionsDiv);
  selectDiv.addEventListener("click", function (e) {
    // when the select box is clicked, close any other select boxes,
    //  and open/close the current select box
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

/* A function that will close all select boxes in the document,
  except the current select box */
function closeAllSelect(elmnt) {
  let selectItems,
    selected,
    i,
    xl,
    yl,
    arrNo = [];
  selectItems = document.getElementsByClassName("select-items");
  selected = document.getElementsByClassName("select-selected");
  xl = selectItems.length;
  yl = selected.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == selected[i]) {
      arrNo.push(i);
    } else {
      selected[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      selectItems[i].classList.add("select-hide");
    }
  }
}
// if the user clicks anywhere outside the select box,
// then close all select boxes
document.addEventListener("click", closeAllSelect);
