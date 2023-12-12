import React from 'react';
import Link from 'next/link';
import { Button, ButtonVariant } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { ICta } from '@/types/contentful';

export const CTA = ({ fields, sys }: ICta) => {
  console.log(fields);
  if (!fields.isAIGenerated && sys.id == '2EYZVfzcmEynCBhPBT2Rxf') {
    fields.isAIGenerated = true;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto my-10 lg:my-20 text-center py-4 lg:py-2 px-4 sm:px-6 lg:px-12">
        <RichText
          className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
          richTextDocument={fields.headline}
        />
        {fields.isAIGenerated ? (
          <div className="gradient-border p-[3px] rounded-lg overflow-hidden relative mt-3">
            <div className="bg-white p-3 rounded-md">
              <RichText
                className="my-1 text-xl text-gray-500"
                richTextDocument={fields.subline}
              />
              <div
                className="mt-2 text-gray-400 w-auto italic"
                style={{ fontSize: '0.6rem', textAlign: 'left' }}
              >
                This text was generated for you by AI ✨
              </div>
            </div>
          </div>
        ) : (
          <RichText
            className="my-1 mt-3 text-xl text-gray-500"
            richTextDocument={fields.subline}
          />
        )}

        <div className="mt-5 mx-auto flex flex-col sm:flex-row lg:w-6/12 sm:w-full items-center justify-center space-y-5 sm:space-y-0 sm:space-x-5">
          {fields.buttons?.map((button) => {
            if (!button.fields.slug) {
              return null;
            }
            return (
              <div key={button.sys.id} className="shadow w-full">
                <Link passHref href={button.fields.slug} legacyBehavior>
                  <Button
                    as="a"
                    type="button"
                    variant={button.fields.variant as ButtonVariant}
                    size="large"
                  >
                    {button.fields.buttonText}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CTA;
