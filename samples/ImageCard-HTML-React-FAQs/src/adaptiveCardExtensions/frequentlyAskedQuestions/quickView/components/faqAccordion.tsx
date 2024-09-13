// A react functional component that renders the FAQ accordion

import * as React from 'react';
import { Accordion, AccordionItem as Item } from '@szhsin/react-accordion';
import { FAQ } from '../../../../types';
import { createAccordionStyles, chevronDown } from '../../styles';
import { Remarkable } from 'remarkable';
import * as DOMPurify from 'dompurify';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { useThemedStyles } from '../../hooks/useThemedStyles';

export interface IFAQAccordionProps {
    faqs: FAQ[];
    allowMultipleExpanded: boolean;
    theme: IReadonlyTheme | undefined;
}

export const FAQAccordion: React.FunctionComponent<IFAQAccordionProps> = (props) => {
    const { faqs, allowMultipleExpanded, theme } = props;
    const accordionStyles = useThemedStyles(theme, createAccordionStyles);
    const chevronDownIcon = chevronDown(theme);
    
    const md = new Remarkable({
        html: true
    });
    faqs.forEach(faq => {
        faq.answer = md.render(faq.answer);
    });

    const AccordionItem: React.FC<{ header: string } & React.ComponentProps<typeof Item>> = ({ header, ...rest }) => (
        <Item
            {...rest}
            header={
                <>
                    {header}
                    <img className="chevron-down" src={chevronDownIcon} alt="Chevron Down" />
                </>
            }
        />
    );

    return (
        <div className={accordionStyles.accordion}>
            <Accordion transition transitionTimeout={500} allowMultiple={allowMultipleExpanded}>
                {props.faqs.map((faq, index) => (
                    <AccordionItem header={faq.question}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }} />
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};