import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";


interface StepperProps {
  steps: number
  currentStep: number
  vertical?: boolean
  onChange?: (step: number) => void
}

export function Stepper({ steps, currentStep, vertical = false, onChange }: StepperProps) {
  return (
    <div className={cn(
      "flex",
      vertical ? "flex-col space-y-2" : "justify-between space-x-2"
    )}>
      {Array.from({ length: steps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "flex items-center",
            vertical && "flex-row space-x-2"
          )}
        >
          <button
            onClick={() => onChange && onChange(step)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              step <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
              onChange && "cursor-pointer hover:bg-primary/80"
            )}
          >
            {step}
          </button>
          {vertical && step < steps && (
            <div className="flex-1 h-10 flex items-center">
              <div className="h-full w-0.5 bg-muted" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}




interface Step {
  title: string;
  content: React.ReactNode;
}

interface StepperContentProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;

  className?: string;
}

export function StepperContent({
  steps,
  currentStep,
  onNext,
  onPrevious,

  className,
}: StepperContentProps) {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(currentStep - 1, 300);
    }
  }, [currentStep]);

  const handleSlideChange = (swiper: any) => {
    const newStep = swiper.activeIndex + 1;
    if (newStep > currentStep) {
      onNext();
    } else if (newStep < currentStep) {
      onPrevious();
    }
  };

  return (
    <div className={cn("w-full ", className)}>
      <Swiper
        
        ref={swiperRef}
        spaceBetween={1}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        allowTouchMove={true}
      >
        {steps.map((step, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-y-auto grow w-full">
              {/* <h2 className="text-lg font-semibold mb-4">{step.title}</h2> */}
              {step.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
}


//example 

{/* 
    function example () {
    
     const steps = [
    {
      title: "Title and Description",
      content: (
        <div className="space-y-6 p-4 ">
          <Input
            id="title"
            placeholder="Enter a catchy title for your listing"
            className="mt-1"
          />

          <Textarea
            id="description"
            placeholder="Describe your place"
            rows={4}
            className="mt-1"
          />
        </div>
      ),
    },

    {
      title: "Add Images",
      content: (
        <div>
          <UserImageGallary
            onChange={(v) => console.log("v :>> ", v)}
            path={"/listing"}
          />
        </div>
      ),
    },
    {
      title: "Tags",
      content: (
        <div>
          <div className="flex items-center space-x-2 mt-1">
            <TagIcon className="h-5 w-5 text-gray-400" />
            <TagsInput
              id="tags"
              placeholder="Enter tags separated by commas"
              className="flex-1"
              tags={["undefined"]}
              setTags={() => {}}
            />
          </div>
        </div>
      ),
    },
  ];

  const handleNextStep = () =>
    setstep((prev) => Math.min(prev + 1, steps.length));
  const handlePrevStep = () => setstep((prev) => Math.max(prev - 1, 1));
  const [step, setstep] = useState(1);
    
    return (
    <CardContent className="pt-6">
          <div className="flex flex-col  grow w-full">
            <div dir={"ltr"} className="">
              <Stepper
                steps={steps.length}
                currentStep={step}
                onChange={setstep}
              />
            </div>
            <div className="w-full">
              <StepperContent
                steps={steps}
                currentStep={step}
                onNext={handleNextStep}
                onPrevious={handlePrevStep}
              />
            </div>
          </div>
        </CardContent> )
        
}
        */}