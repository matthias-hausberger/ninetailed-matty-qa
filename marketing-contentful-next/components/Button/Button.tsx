import React from 'react';

import { handleErrors } from '@/lib/helperfunctions';
import { useNinetailed } from '@ninetailed/experience.js-next';
import Link from 'next/link';
import { useFlag } from '@ninetailed/experience.js-next';

import type { TypeButtonWithoutUnresolvableLinksResponse } from '@/types/TypeButton';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'small' | 'large';
export type ButtonVariant =
  TypeButtonWithoutUnresolvableLinksResponse['fields']['variant'];

const sizeMap = {
  small: 'py-2 px-3',
  large: 'py-3 px-6',
};

export interface ButtonProps {
  as?: React.ElementType | typeof Link;
  children: string;
  disabled?: boolean;
  eventType?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventType'];
  eventName?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventName'];
  eventPayload?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventPayload'];
  href?: string;
  size: ButtonSize;
  type: ButtonType;
  variant: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  (props: ButtonProps, ref) => {
    const {
      as: Component = 'button',
      size: size = 'large',
      children,
      eventType,
      eventName,
      eventPayload,
      disabled,
      href,
      variant,
      type,
    } = props;

    /**
     * We previously used Tailwind utility class strings as the values of the feature flag "buttonColors" (e.g. "bg-indigo-600 text-white").
     * Tailwind classes resolved at build time cannot be introduced dynamically at runtime from a flag, so those dynamic
     * class names would be purged and not work. To support runtime color changes we now expect the flag values to be
     * style objects (inline CSS) like:
     * {
     *   "primary": { "backgroundColor": "#4f46e5", "color": "#ffffff" },
     *   "secondary": { "backgroundColor": "#e0e7ff", "color": "#4338ca" },
     *   "loud": { "backgroundColor": "#d97706", "color": "#ffffff" }
     * }
     * This keeps the structural / layout Tailwind classes in code (which are known at build time) while allowing colors
     * to change via Ninetailed Flags.
     *
     * Backwards compatibility: If a variant value is still a string we will treat it as a (legacy) class list and append it.
     */
    type VariantStyle = { backgroundColor?: string; color?: string };
    type VariantValue = string | VariantStyle;
    type VariantFlagMap = Record<string, VariantValue>;

    const defaultVariantMap: VariantFlagMap = {
      primary: { backgroundColor: '#4f46e5', color: '#ffffff' },
      secondary: { backgroundColor: '#e0e7ff', color: '#4338ca' },
      loud: { backgroundColor: '#d97706', color: '#ffffff' },
    };

    const { value: variantMap } = useFlag('buttonColors', defaultVariantMap, {
      shouldAutoTrack: false,
    }) as { value: VariantFlagMap };

    const variantValue = variantMap?.[variant];
    const variantInlineStyle: React.CSSProperties | undefined =
      variantValue &&
      typeof variantValue === 'object' &&
      !Array.isArray(variantValue)
        ? variantValue
        : undefined;
    const variantClassNames =
      variantValue && typeof variantValue === 'string' ? variantValue : '';

    console.log("Variant map from flag 'buttonColors':", variantMap);

    /*let variantMap = {
      primary: 'bg-indigo-600 text-white',
      secondary: 'bg-indigo-100 text-indigo-700',
      loud: 'bg-amber-600 text-white',
    };*/

    const { track, identify } = useNinetailed();

    const trackButtonClick = handleErrors(async (e: Event) => {
      if (eventType) {
        if (type === 'submit') {
          e.preventDefault();
        }
        switch (eventType) {
          case 'track':
            if (eventName) {
              await track(
                eventName,
                (eventPayload as Record<
                  PropertyKey,
                  string | number | (string | number)[]
                >) ?? {}
              );
              console.log(
                `Sent Ninetailed track event with event name ${eventName} and properties:`,
                `${JSON.stringify(eventPayload, null, 2)}`
              );
            } else {
              console.log('No event name provided, skipped track call');
            }
            break;
          case 'identify':
            await identify(
              eventName ?? '',
              (eventPayload as Record<
                PropertyKey,
                string | number | (string | number)[]
              >) ?? {}
            );
            console.log(
              `Sent Ninetailed identify event with ${
                eventName ? `userId ${eventName}` : 'no userId'
              } and traits:`,
              `${JSON.stringify(eventPayload, null, 2)}`
            );
            break;
        }
      } else {
        console.log('Button without event clicked');
      }
    });

    return (
      <>
        <Component
          href={href}
          type={type}
          ref={ref}
          className="block bg-gray-900 disabled:opacity-80"
          disabled={disabled}
          onClick={trackButtonClick}
        >
          <div
            className={`${sizeMap[size]} flex justify-center border-gray-900 border-2 duration-150 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 hover:-translate-x-1.5 hover:-translate-y-1.5 ${variantClassNames}`}
            style={variantInlineStyle}
          >
            {children}
          </div>
        </Component>
      </>
    );
  }
);

Button.defaultProps = {
  as: Link,
};

Button.displayName = 'Button';
