import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faXmark, faFilter } from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;
library.add(faCheck, faXmark, faFilter);

export default FontAwesomeIcon;
