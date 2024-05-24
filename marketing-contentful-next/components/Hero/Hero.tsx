import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, ButtonVariant } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { ContentfulImageLoader } from '@/lib/helperfunctions';
import { IHero } from '@/types/contentful';

import { ContentfulLivePreview } from '@contentful/live-preview';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import classNames from 'classnames';
import { useFlag } from '@/lib/experiences';

export const Hero = ({ sys, fields }: IHero) => {
  const expFlag = useFlag('heroLayout') || 0;

  const updatedHero = useContentfulLiveUpdates({ sys, fields }) as IHero;
  const layoutStyles = [
    {
      direction: 'xl:flex-row',
      transform: '',
    },
    {
      direction: 'xl:flex-row-reverse',
      transform: 'xl:-scale-x-100',
    },
  ];
  return (
    <div className="bg-white xl:pb-12 hero">
      <div className="pt-8 sm:pt-12 xl:relative xl:py-6">
        {/* Hero section */}
        <div
          className={classNames(
            'mx-auto max-w-md px-4 sm:max-w-3xl md:px-8 xl:max-w-7xl flex flex-col items-center xl:gap-24',
            layoutStyles[expFlag].direction
          )}
        >
          <div className="xl:mt-20 xl:w-1/2">
            <div className="mt-6">
              <RichText
                {...ContentfulLivePreview.getProps({
                  entryId: updatedHero.sys.id,
                  fieldId: 'headline',
                })}
                className={classNames(
                  'font-extrabold text-gray-900 text-5xl tracking-tight hero__headline'
                )}
                richTextDocument={updatedHero.fields.headline}
              />
              <RichText
                {...ContentfulLivePreview.getProps({
                  entryId: updatedHero.sys.id,
                  fieldId: 'subline',
                })}
                className="mt-6 text-xl text-gray-500"
                richTextDocument={updatedHero.fields.subline}
              />
            </div>
            <div className="mt-5 mx-auto flex flex-col sm:flex-row justify-start md:mt-8 space-y-5 sm:w-full sm:space-x-5 sm:space-y-0">
              {updatedHero.fields.buttons?.map((button) => {
                if (!button.fields.slug) {
                  return null;
                }

                return (
                  <div key={button.sys.id} className="shadow">
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
          {/* Image */}
          <div
            className={classNames(
              'py-12 sm:relative sm:mt-12 sm:pt-16 xl:inset-y-0 xl:right-0 xl:w-1/2',
              layoutStyles[expFlag].transform
            )}
          >
            <div className="hidden sm:block">
              <div
                className={classNames(
                  'absolute inset-y-0 left-1/2  rounded-l-3xl xl:left-80 xl:right-0',
                  {
                    'bg-indigo-200 w-screen': expFlag === 0,
                  },
                  {
                    'bg-amber-200 blur-2xl m-20 w-full': expFlag === 1,
                  }
                )}
              />
              <svg
                className={classNames(
                  'absolute top-8 right-1/2 -mr-3 xl:m-0 xl:left-0',
                  { hidden: expFlag === 1 }
                )}
                width={404}
                height={392}
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={392}
                  fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                />
              </svg>
              <div
                className={classNames(
                  'absolute w-[440px] h-[440px] rounded-full bg-gradient-to-br from-indigo-600 to-indigo-100 bg-blend-normal blur-2xl',
                  { hidden: expFlag === 0 }
                )}
              />
            </div>

            <div
              className="relative sm:mx-auto xl:pl-12 max-w-full"
              {...ContentfulLivePreview.getProps({
                entryId: updatedHero.sys.id,
                fieldId: 'image',
              })}
            >
              {updatedHero.fields.image.fields?.file.details.image && (
                <Image
                  loader={ContentfulImageLoader}
                  src={`https:${updatedHero.fields.image.fields.file.url}`}
                  width={
                    (updatedHero.fields.image.fields.file.details.image.width *
                      Math.min(
                        590,
                        updatedHero.fields.image.fields.file.details.image
                          .height
                      )) /
                    updatedHero.fields.image.fields.file.details.image.height
                  }
                  height={Math.min(
                    590,
                    updatedHero.fields.image.fields.file.details.image.height
                  )}
                  className="w-full rounded xl:w-auto xl:max-w-none object-cover"
                  style={{
                    width:
                      (updatedHero.fields.image.fields.file.details.image
                        .width *
                        Math.min(
                          590,
                          updatedHero.fields.image.fields.file.details.image
                            .height
                        )) /
                      updatedHero.fields.image.fields.file.details.image.height,
                  }}
                  alt={updatedHero.fields.image.fields.description || ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
