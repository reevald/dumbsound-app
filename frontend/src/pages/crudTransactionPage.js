import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompCrudTabelTransactions from "../compTransactions/crudTableTransactions";

function CrudTransactionPage() {
  return (
    <>
      <CompNavbar isFixedColorNav={true}/>
      <CompWrapper>
        <CompCrudTabelTransactions />
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default CrudTransactionPage;