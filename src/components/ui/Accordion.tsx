"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";
import styles from "./Accordion.module.css";

export type AccordionItem = { question: string; answer: string };

type AccordionProps = {
  items: AccordionItem[];
  /** Index of the item open on first render (-1 for none). */
  defaultOpen?: number;
};

/**
 * Accessible accordion following the WAI-ARIA disclosure pattern:
 * each header is a <button> with aria-expanded/aria-controls,
 * and each panel is a labelled region.
 */
export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);
  const baseId = useId();

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className={styles.item} data-open={open}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
              >
                <span>{item.question}</span>
                <span className={styles.icon}>
                  <Icon name="chevronDown" size={18} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel} hidden={!open}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
