import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// The marker is part of translated copy, including rich text and arrays.
// Enhance visible text after render while leaving image descriptions untouched.
export default function FormulaFootnoteLinks() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const root = document.querySelector('main');
    if (!root) return undefined;
    const inserted = new Set();
    const enhance = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.data.includes('¹') && !node.parentElement.closest('a, button, script, style')) nodes.push(node);
      }
      for (const node of nodes) {
        let current = node;
        while (current.data.includes('¹')) {
          const index = current.data.indexOf('¹');
          const tail = current.splitText(index);
          tail.deleteData(0, 1);
          const link = document.createElement('a');
          link.href = '/formula-student#que-es-formula-sae';
          link.className = 'formula-reference';
          link.textContent = '¹';
          link.setAttribute('aria-label', i18n.t('formulaExplainer.title'));
          tail.before(link);
          inserted.add(link);
          current = tail;
        }
      }
    };
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => {
      observer.disconnect();
      for (const link of inserted) if (link.isConnected) link.replaceWith(document.createTextNode('¹'));
    };
  }, [pathname, i18n, i18n.resolvedLanguage]);
  return null;
}
