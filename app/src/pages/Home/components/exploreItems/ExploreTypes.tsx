import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router";
import Img from "src/components/Image";
import { typeimage } from "src/lib/db/hostTypes";
import { listingsTypes } from "src/lib/db/listings";
interface Props {}


const ExploreTypes = (props: Props) => {
  const navigate = useNavigate();
  const {t} = useTranslate()

  return listingsTypes.map((type) => {
    return (
      <div
      key={type+"type"}
        onClick={() => navigate(`search?type=${type}`)}
        className={"  items-center h-16  mt-2 max-w-md overflow-clip relative"}
      >
        <Img
          className={"object-cover  overflow-hidden  w-full h-full "}
          src={typeimage(type)}
        />
        <div
          className={
            "absolute  bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-center justify-start w-full overflow-clip"
          }
        >
          <h1
            className={
              " inset-4 ms-3 overflow-clip  text-2xl font-sans text-white  text-start capitalize truncate "
            }
          >
            {t(type)}
          </h1>
        </div>
      </div>
    );
  });
};

export default ExploreTypes;
