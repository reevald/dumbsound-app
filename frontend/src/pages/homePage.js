import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompHero from "../compHomePage/hero";
import CompListPlayMusic from "../compHomePage/listPlayMusic";

import { ModalContextProvider } from '../context/modalContext';

function HomePage() {
  return (
    <ModalContextProvider>
      <CompNavbar isFixedColorNav={false} />
      <CompWrapper>
        <CompHero />
        <CompListPlayMusic />
      </CompWrapper>
      <CompFooter />
    </ModalContextProvider>
  );
}

export default HomePage;