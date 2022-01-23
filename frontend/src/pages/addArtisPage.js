import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompFormAddArtis from "../compAddArtisPage/formAddArtis";

function AddArtisPage() {
  return (
    <>
      <CompNavbar isFixedColorNav={true}/>
      <CompWrapper>
        <CompFormAddArtis />
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default AddArtisPage;