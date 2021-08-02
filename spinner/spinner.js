let padding = { top: 20, right: 40, bottom: 0, left: 0 },
  w = 500 - padding.left - padding.right,
  h = 500 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = [
    "#f7cbc8",
    "#203368",
    "#b8cc94",
    "#f1782b",
    "#90a7d0",
    "#f5be3e",
    "#005084",
    "#fbdd39",
    "#96dbde",
    "#ff9aa2",
    "#9897a4",
    "#df4731",
    "#cc99c9",
    "#b08d6a",
    "#76c353",
    "#e09397",
    "#17becf",
    "#976fab",
    "#fd8d3c",
    "#9edae5",
    "#c08eb8",
    "#d9d9d9",
    "#fdfd97",
    "#e27667",
    "#9ec1ce",
    "#f15128",
    "#9edae5",
    "#d62728",
    "#c5b0d5",
  ];
color = [
  "#0A7B83",
  "#2AA876",
  "#FFD265",
  "#be8c98",
  "#F19C65",
  "#CE4D45",
  "#7270af",
  "#57315A",
  "#d87e8c",
  "#8cb1be",
  "#8C2B59",
  "#D8A2AF",
  "#E4E8E8",
  "#F1A23C",
  "#5C4B51",
  "#8CBEB2",
  "#F2EBBF",
  "#F3B562",
  "#66BB6A",
  "#F06060",
];
// color = d3.scale.category10();
// get random start index for color
const colorStart = Math.floor(Math.random() * color.length);
// define team members
const teamMembers = {
  DASH: [
    {
      name: "Amber",
      value: 1,
    },
    {
      name: "Barak",
      value: 2,
    },
    {
      name: "Bryan",
      value: 3,
    },
    {
      name: "Emma",
      value: 4,
    },
    {
      name: "Michael",
      value: 5,
    },
    {
      name: "Sagnik",
      value: 6,
    },
  ],
  INFRA: [
    {
      name: "Christina",
      value: 1,
    },
    {
      name: "Derek",
      value: 2,
    },
    {
      name: "Eva",
      value: 3,
    },
    {
      name: "Harnoor",
      value: 4,
    },
    {
      name: "Mike K",
      value: 5,
    },
  ],
  SURF: [
    {
      name: "Daphne",
      value: 1,
    },
    {
      name: "Joan",
      value: 2,
    },
    {
      name: "Justin",
      value: 3,
    },
    {
      name: "Wolfgang",
      value: 4,
    },
  ],
};
function generateSpinner(team) {
  let data = teamMembers[team];
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
      return color[(colorStart + i) % color.length];
    })
    .style("stroke", "black")
    .attr("d", function (d) {
      return arc(d);
    });
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
    .text(function (d, i) {
      return data[i].name;
    });
  container.on("click", spin);
  function spin(d) {
    container.on("click", null);
    if (oldpick.length == data.length) {
      container.on("click", null);
      return;
    }
    let ps = 360 / data.length,
      pieslice = Math.round(1440 / data.length),
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
        d3.select("#chosenPerson h1").text(data[picked].name);
        oldrotation = rotation;

        /* Comment the below line for restrict spin to sngle time */
        container.on("click", spin);
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
    .attr("r", 60)
    .style({ fill: "white", cursor: "pointer", stroke: "black" });
  //spin text
  container
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-size": "30px" });
}

generateSpinner("DASH");

function rotTween(to) {
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
    //no support for crypto, get crappy random numbers
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

let select, i, j, l, ll, selElmnt, a, b, c;
select = document.getElementsByClassName("custom-select");
l = select.length;
for (i = 0; i < l; i++) {
  selElmnt = select[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  // for each element, create a new div that will act as the selected item
  a = document.createElement("div");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  select[i].appendChild(a);
  // for each element, create a new DIV that will contain the option list
  b = document.createElement("div");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    // for each option in the original select element,
    // create a new DIV that will act as an option item
    c = document.createElement("div");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      // when an item is clicked, update the original select box,
      // and the selected item
      var y, i, k, s, h, sl, yl;
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
    b.appendChild(c);
  }
  select[i].appendChild(b);
  a.addEventListener("click", function (e) {
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
