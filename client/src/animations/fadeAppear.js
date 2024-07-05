import React, { useEffect, useRef } from 'react';

const observeElements = (elements, observer) => {
  elements.forEach((element) => {
    observer.observe(element);
    element.style.opacity = '0'; // Set initial opacity to 0
  });
};

const observeNestedElements = (node, observer) => {
  if (!node) return;

  if (
    node.nodeType === 1 &&
    (node.classList.contains('fadeAppear') ||
      node.classList.contains('fadeAppearTitle'))
  ) {
    observer.observe(node);
    node.style.opacity = '0'; // Set initial opacity to 0
  }

  if (node.childNodes) {
    node.childNodes.forEach((child) => {
      observeNestedElements(child, observer);
    });
  }
};

const FadeObserver = ({ children }) => {
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('observed');
            observer.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 } // Adjust threshold as needed
    );

    // Observe initial elements with .fadeAppear and .fadeAppearTitle classes
    const initialElements = document.querySelectorAll(
      '.fadeAppear, .fadeAppearTitle'
    );
    observeElements(initialElements, observer.current);

    // Observe dynamically added elements within the entire document
    const mutationObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            observeNestedElements(node, observer.current);
          });
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, []);

  return <div>{children}</div>;
};

export default FadeObserver;
