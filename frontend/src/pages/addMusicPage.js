import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompFormAddMusic from "../compAddMusicPage/formAddMusic";

function AddMusicPage() {
  return (
    <>
      <CompNavbar isFixedColorNav={true}/>
      <CompWrapper>
        <CompFormAddMusic />
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default AddMusicPage;