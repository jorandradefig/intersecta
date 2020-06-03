
const animationKeyFrames = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 },
  ],
  fadeOut: [
    { opacity: 1 },
    { opacity: 0 },
  ],
};

/**
 * Options for the intersection observer API
 *
 * @param {Element} root object whose bounding box is used as the bounds of the viewport
 * @param {string} rootMargin offsets for one or more sides of the root's bounding box.
 * @param {number} threshold list or value of intersection thresholds for the observer
 * @returns {object} with the defined or default options
 */
const setObserverOptions = ({
  root = null,
  rootMargin = '0px',
  threshold = 1,
} = {}) => ({
  root,
  rootMargin,
  threshold,
});

const setAnimationOptions = ({
  selector = null,
  threshold = 1,
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  easing = 'linear',
  fill = 'forwards',
  once = true,
} = {}) => ({
  selector,
  threshold,
  animation,
  duration,
  delay,
  easing,
  fill,
  once,
});

/**
 * This function initializes a scrolling direction tracker
 * Working code but currently not in use

let withScrollingDirection = () => {
  let currentY = window.scrollY;
  let previousY = 0;

  let isDownwards = () => currentY > previousY;

  let updatePosition = () => {
    previousY = currentY;
    currentY = window.scrollY;
  };

  let isScrollingDown = () => {
    updatePosition();
    return isDownwards();
  }
  return {
    isScrollingDown: isScrollingDown,
    updatePosition: updatePosition
  }
}
*/

const handleEntry = (entry, observer, options) => {
  const {
    duration, fill, delay, easing,
  } = options;
  const animationOptions = {
    duration, fill, delay, easing,
  };
  if (entry.isIntersecting) {
    entry.target.animate(
      // keyframes
      animationKeyFrames[options.animation],
      // timing options
      animationOptions,
    );
    // when enabled, remove observer after effect played once
    if (options.once) observer.unobserve(entry.target);
  } else {
    entry.target.animate(
      // keyframes
      animationKeyFrames[options.animation],
      // timing options
      { direction: 'reverse', ...animationOptions },
    );
  }
};

const createObserver = (userOptions) => {
  if (!userOptions.selector) throw new Error('No selector was given, expected a string');

  const options = setAnimationOptions(userOptions);
  const selectItems = document.querySelectorAll(options.selector);
  const intersectionEffect = (entries, observer) => {
    entries.forEach((entry) => handleEntry(entry, observer, options));
  };
  const observer = new IntersectionObserver(intersectionEffect, setObserverOptions(options));
  selectItems.forEach((t) => observer.observe(t));
};
export { createObserver as default };
