// ==UserScript==
// @name         Floating Point Tips
// @version      1.0
// @description  Allow floating point values in post tips
// @match        https://upload.cx/*
// @match        https:/lst.gg/*
// @match        https://fearnopeer.com/*
// @match        https://ldu.to/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function enableFloatingPointTips() {
        const postTipInputs = document.querySelectorAll('input.post__tip-input');
        const torrentTipInputs = document.querySelectorAll('input.form__text[name="bon"]');
        
        const allTipInputs = [...postTipInputs, ...torrentTipInputs];

        let modifiedCount = 0;
        allTipInputs.forEach(input => {
            if (input.hasAttribute('pattern')) {
                input.removeAttribute('pattern');
                modifiedCount++;
                
                if (input.getAttribute('inputmode') === 'numeric') {
                    input.setAttribute('inputmode', 'decimal');
                }
            }
        });
    }

    function observeForNewInputs() {
        const observer = new MutationObserver(mutations => {
            let hasNewInputs = false;

                            mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList && node.classList.contains('post__tip-input')) {
                                    hasNewInputs = true;
                                } else if (node.classList && node.classList.contains('form__text') && node.name === 'bon') {
                                    hasNewInputs = true;
                                } else if (node.querySelector && (node.querySelector('.post__tip-input') || node.querySelector('input.form__text[name="bon"]'))) {
                                    hasNewInputs = true;
                                }
                            }
                        });
                    }
                });

            if (hasNewInputs) {
                setTimeout(enableFloatingPointTips, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(enableFloatingPointTips, 500);
            observeForNewInputs();
        });
    } else {
        setTimeout(enableFloatingPointTips, 500);
        observeForNewInputs();
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(enableFloatingPointTips, 1000);
        }
    });

})(); 
