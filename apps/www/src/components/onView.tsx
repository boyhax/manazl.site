import { useInView } from "react-intersection-observer";

const OnView = ({ children,holder }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });

  if(inView){
    return children
  }
  return (
    <div  ref={ref}>
      {holder}
    </div>
  );
};
export default OnView;
