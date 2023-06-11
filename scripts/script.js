document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const wrapper = document.querySelector(".wrapper");
  const frameRate = 2;
  const minScale = 0.3;
  const maxScale = 1.1;
  const scaleRange = maxScale - minScale;
  let lastFrame;
  let width = window.innerWidth;
  let items = document.querySelectorAll(".item");
  let timer;
  let ul;
  let index = 0;

  // this helper function stolen from a hero on stackoverflow
  function dynamicSort(property) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  if (width > 768) {
    function animateChildren(parent, origin) {
      const children = Array.from(parent.children);
      const childrenWithDistances = [];

      children.map((child) => {
        const r = child.getBoundingClientRect();
        const childX = r.right - r.width / 2;
        const childY = r.bottom - r.height / 2;
        const distanceY =
          Math.max(origin.y, childY) - Math.min(origin.y, childY);
        const distanceX =
          Math.max(origin.x, childX) - Math.min(origin.x, childX);
        const hypot = Math.hypot(distanceX, distanceY);

        child.distance = Math.round(hypot);
        childrenWithDistances.push(child);
      });

      childrenWithDistances.sort(dynamicSort("distance")).reverse();

      childrenWithDistances.map((child, index) => {
        const relativeAmt = (index / children.length) * scaleRange;
        child.style.setProperty("--scale", minScale + relativeAmt);
      });
    }

    document.addEventListener("mousemove", function (e) {
      requestAnimationFrame(function (thisFrame) {
        if (thisFrame - lastFrame > frameRate) {
          const screenCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          };
          const moveX = e.x - screenCenter.x;
          const moveY = e.y - screenCenter.y;

          wrapper.style.setProperty("--x", moveX / 10 + "%");
          wrapper.style.setProperty("--y", moveY / 10 + "%");

          animateChildren(wrapper, e);
        }

        lastFrame = thisFrame;
      });
    });

    // Load au survol
    items.forEach((item) => {
      item.addEventListener("mouseenter", addLoad);
    });

    items.forEach((item) => {
      item.addEventListener("mouseleave", removeLoad);
    });

    function addLoad() {
      var that = this;
      timer = setTimeout(function () {
        that.classList.add("load");
        ul = that.querySelector("ul");
        loadBg(ul);
      }, 800);
    }

    function removeLoad() {
      this.classList.remove("load");
      index = 0;
      clearTimeout(timer);
    }
  }

  document.body.addEventListener("scroll", function (e) {
    const screenCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    animateChildren(wrapper, screenCenter);
  });

  // Load au click
  items.forEach((item) => {
    item.addEventListener("click", clickOnItem);
  });

  document.querySelector("body").addEventListener("click", clickOuterItem);

  function clickOnItem(e) {
    this.classList.add("load");
    ul = this.querySelector("ul");
    loadBg(ul);
    e.stopPropagation();
  }

  function clickOuterItem() {
    items.forEach((item) => {
      item.classList.remove("load");
    });
  }

  // onClick on .slideLeft or .slideRight
  document.querySelectorAll(".slideLeft").forEach((slide) => {
    slide.addEventListener("click", () => {
      ul = slide.parentNode.querySelector("ul");
      index--;
      loadBg(ul);
    });
  });

  document.querySelectorAll(".slideRight").forEach((slide) => {
    slide.addEventListener("click", () => {
      ul = slide.parentNode.querySelector("ul");
      index++;
      loadBg(ul);
    });
  });

  const loadBg = (ul) => {
    if (ul) {
      const left = ul.parentNode.querySelector(".slideLeft");
      const right = ul.parentNode.querySelector(".slideRight");

      let textContainer = ul.parentNode.querySelector(".textContainer");
      let length = ul.children.length;

      // Supression des fleches si la liste ne contient qu'un seul elt
      if (length > 1) {
        if (right.classList.contains("disabled"))
          right.classList.remove("disabled");

        if (left.classList.contains("disabled"))
          left.classList.remove("disabled");

        if (index === length - 1) {
          right.classList.add("disabled");
        }
        if (index === 0) {
          left.classList.add("disabled");
        }

        for (i = 0; i < length; i++) {
          ul.children[i].style.display = "none";
        }

        if (index > length - 1) {
          index = length - 1;
          right.classList.add("disabled");
        }
        if (index < 0) {
          index = 0;
          left.classList.add("disabled");
        }

        if (index === 0) {
          textContainer.style.display = "block";
        } else {
          textContainer.style.display = "none";
        }
      }
      ul.children[index].style.display = "block";
    }
  };
}
