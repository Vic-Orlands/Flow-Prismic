import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  JSXMapSerializer,
  SliceComponentProps,
} from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";

const components: JSXMapSerializer = {
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className="text-center mb-9 font-semibold">
      {children}
    </Heading>
  ),
  paragraph: ({ children }) => (
    <p className="text-xl md:text-2xl font-normal text-slate-600 mb-8 font-body">
      {children}
    </p>
  ),
};

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = async ({
  slice,
}: TestimonialsProps): Promise<JSX.Element> => {
  const client = createClient();

  const testimonials = await Promise.all(
    slice.primary.testimonials.map((item) => {
      if (
        isFilled.contentRelationship(item.testimonial) &&
        item.testimonial.uid
      ) {
        return client.getByUID("testimonial", item.testimonial.uid);
      }
    })
  );

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText field={slice.primary.heading} components={components} />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
        {testimonials.map(
          (item, index) =>
            item && (
              <div
                key={index}
                className="border bg-white shadow-lg rounded-lg px-8 md:px-14 py-10 md:py-16 grid content-between"
              >
                <PrismicRichText
                  field={item.data.quote}
                  components={components}
                />

                <div className="flex items-center">
                  <PrismicNextImage
                    width={56}
                    height={56}
                    field={item.data.avatar}
                    className="rounded-full mr-4 aspect-square"
                    imgixParams={{ ar: "1:1", fit: "crop" }}
                  />

                  <div>
                    <p className="text-base text-slate-700 font-medium">
                      {item.data.name}
                    </p>
                    <p className="text-base text-slate-600">
                      {item.data.job_title}
                    </p>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </Bounded>
  );
};

export default Testimonials;
