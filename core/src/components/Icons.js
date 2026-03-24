import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { 
  faCheck, 
  faXmark, 
  faTimes, 
  faMultiply,
  faFilter,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faSort
} from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

library.add(
  faCheck, 
  faXmark, 
  faTimes, 
  faMultiply,
  faFilter,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faSort
);

export default FontAwesomeIcon;